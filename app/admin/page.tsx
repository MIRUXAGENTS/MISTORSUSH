'use client';

import { useState, useEffect, useCallback } from 'react';
import { sb } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { menuCategories, resolveImagePath } from '@/lib/menuData';
import imageCompression from 'browser-image-compression';
import ScrollTopButton from '@/components/ScrollTopButton';
import { isAdmin } from '@/lib/authUtils';
import { useRouter } from 'next/navigation';

// --- Types ---
interface Order {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  order_type: string;
  comment: string;
  total_sum: number;
  status: string;
  delivery_time: string;
  customer_email?: string;
  items_json: { order_items: string; cart?: Record<string, number> };
}

interface SupabaseProduct {
  id: any;
  name: string;
  name_en: string;
  name_he: string;
  price: number;
  ingredients: string;
  ingredients_en: string;
  ingredients_he: string;
  is_available: boolean;
  category: string;
  image_url?: string;
}

type ActiveTab = 'dashboard' | 'orders' | 'products' | 'archive';

const STATUS_OPTIONS = ['new', 'Готовится', 'Курьер в пути', 'Завершен'];

function getStatusStyle(status: string): string {
  switch (status) {
    case 'new': return 'text-brand border-brand/20 bg-brand/5';
    case 'Готовится': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    case 'Курьер в пути': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
    case 'Завершен': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    default: return 'text-muted border-white/10 bg-white/5';
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [archive, setArchive] = useState<Order[]>([]);
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Site status state
  const [isSiteActive, setIsSiteActive] = useState(true);
  const [siteStatusId, setSiteStatusId] = useState<number | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveFilter, setArchiveFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [adminProductCat, setAdminProductCat] = useState<string>('');

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user && isAdmin(user.email)) {
        setIsAuthorized(true);
      } else {
        router.replace('/');
      }
    });

    const { data: authListener } = sb.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user || null;
        setCurrentUser(user);
        if (user && isAdmin(user.email)) {
          setIsAuthorized(true);
        } else {
          router.replace('/');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      loadOrders();
      loadProducts();
      loadSiteStatus();
    }
  }, [isAuthorized]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from('orders').select('*').neq('status', 'Завершен').order('id', { ascending: true });
    setOrders(data || []);
    setLoading(false);
  }, []);

  const loadArchive = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from('orders').select('*').eq('status', 'Завершен').order('created_at', { ascending: false }).limit(50);
    setArchive(data || []);
    setLoading(false);
  }, []);

  const loadProducts = useCallback(async () => {
    const { data } = await sb.from('products').select('*').neq('category', 'system_config').order('id', { ascending: true });
    setProducts(data || []);
  }, []);

  useEffect(() => {
    if (activeTab === 'archive') loadArchive();
  }, [activeTab, loadArchive]);

  async function updateOrderStatus(orderId: number, status: string) {
    await sb.from('orders').update({ status }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    if (status === 'Завершен') {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    }
  }

  async function deleteOrder(orderId: number) {
    if (!confirm('Удалить заказ?')) return;
    await sb.from('orders').delete().eq('id', orderId);
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setArchive(prev => prev.filter(o => o.id !== orderId));
    if (selectedOrder?.id === orderId) setSelectedOrder(null);
  }

  async function restoreOrder(order: Order) {
    if (!confirm('Вернуть заказ в список новых?')) return;
    await sb.from('orders').update({ status: 'new' }).eq('id', order.id);
    setArchive(prev => prev.filter(o => o.id !== order.id));
    // Check if order already in orders to avoid duplicates
    setOrders(prev => {
      if (prev.find(o => o.id === order.id)) return prev;
      return [...prev, { ...order, status: 'new' }].sort((a, b) => a.id - b.id);
    });
    if (selectedOrder?.id === order.id) setSelectedOrder(null);
  }

  async function loadSiteStatus() {
    const { data } = await sb.from('products').select('*').eq('name', 'system_site_status');
    if (data && data.length > 0) {
      setIsSiteActive(data[0].is_available);
      setSiteStatusId(data[0].id);
    } else {
      // Create if doesn't exist
      const newStatus = {
        name: 'system_site_status',
        category: 'system_config',
        price: 0,
        is_available: true,
        ingredients: 'Флаг работы сайта (true - включен, false - выключен)',
        item_id: 'SYS_STATUS'
      };
      const { data: newData } = await sb.from('products').insert([newStatus]).select().single();
      if (newData) {
        setIsSiteActive(true);
        setSiteStatusId(newData.id);
      }
    }
  }

  async function toggleSiteStatus() {
    if (siteStatusId === null) return;
    setStatusLoading(true);
    const newVal = !isSiteActive;
    const { error } = await sb.from('products').update({ is_available: newVal }).eq('id', siteStatusId);
    if (!error) {
      setIsSiteActive(newVal);
    }
    setStatusLoading(false);
  }

  // Filtering Logic
  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toString().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_phone.includes(query) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(query))
    );
  });

  const filteredArchive = archive.filter(order => {
    // Search query filter
    const query = searchQuery.toLowerCase();
    const matchesQuery = (
      order.id.toString().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_phone.includes(query) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(query))
    );

    if (!matchesQuery) return false;

    // Period filter
    if (archiveFilter === 'all') return true;

    const orderDate = new Date(order.created_at);
    const now = new Date();

    switch (archiveFilter) {
      case 'today':
        return orderDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return orderDate >= monthAgo;
      case 'year':
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        return orderDate >= yearAgo;
      default:
        return true;
    }
  });

  async function toggleProductAvailability(product: SupabaseProduct) {
    const newVal = !product.is_available;
    await sb.from('products').update({ is_available: newVal }).eq('id', product.id);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_available: newVal } : p));
  }

  async function saveProduct() {
    if (!selectedProduct) return;
    setSaveMessage('Сохраняем...');
    if (isNewProduct) {
      const { id, ...insertPayload } = selectedProduct;
      const { error } = await sb.from('products').insert([insertPayload]);
      if (error) { setSaveMessage('Ошибка: ' + error.message); return; }
    } else {
      const { id, ...updatePayload } = selectedProduct;
      const { error } = await sb.from('products').update(updatePayload).eq('id', selectedProduct.id);
      if (error) { setSaveMessage('Ошибка: ' + error.message); return; }
    }
    setSaveMessage('Сохранено!');
    await loadProducts();
    setTimeout(() => setSaveMessage(''), 2000);
    setSelectedProduct(null);
    setIsNewProduct(false);
  }

  async function deleteProductAdmin(product: SupabaseProduct) {
    if (!confirm(`Удалить товар "${product.name}"? Это действие нельзя отменить.`)) return;

    // Cleanup image from bucket if exists
    if (product.image_url && product.image_url.includes('/product-images/')) {
      const urlParts = product.image_url.split('/product-images/');
      if (urlParts.length === 2 && urlParts[1]) {
        await sb.storage.from('product-images').remove([urlParts[1]]);
      }
    }

    const { error } = await sb.from('products').delete().eq('id', product.id);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      if (selectedProduct?.id === product.id) {
        setSelectedProduct(null);
        setIsNewProduct(false);
      }
    } else {
      alert('Ошибка при удалении: ' + error.message);
    }
  }

  async function handleImageUpload(file: File, productToUpdate: SupabaseProduct) {
    setIsUploading(true);
    setSaveMessage('Сжатие (WebP)...');
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp',
      };
      const compressedFile = await imageCompression(file, options);

      setSaveMessage('Загрузка в Supabase...');
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.webp`;
      const filePath = `${productToUpdate.category}/${fileName}`;

      const { data, error } = await sb.storage
        .from('product-images')
        .upload(filePath, compressedFile, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: publicData } = sb.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Clean up the old image from the bucket to prevent orphans accumulating
      if (productToUpdate.image_url && productToUpdate.image_url.includes('/product-images/')) {
        const urlParts = productToUpdate.image_url.split('/product-images/');
        if (urlParts.length === 2 && urlParts[1]) {
          const { error: rmError } = await sb.storage.from('product-images').remove([urlParts[1]]);
          if (rmError) {
            console.error("Не удалось удалить старое фото (возможно, нет прав DELETE в Supabase):", rmError);
          }
        }
      }

      setSelectedProduct(prev => prev ? { ...prev, image_url: publicData.publicUrl } : { ...productToUpdate, image_url: publicData.publicUrl });
      setSaveMessage('Фото загружено!');
    } catch (err: any) {
      console.error(err);
      setSaveMessage('Ошибка: ' + err.message);
    } finally {
      setIsUploading(false);
      setTimeout(() => setSaveMessage(''), 2000);
    }
  }

  function createNewProduct() {
    setIsNewProduct(true);
    setSelectedProduct({
      id: 0,
      name: '',
      name_en: '',
      name_he: '',
      price: 0,
      ingredients: '',
      ingredients_en: '',
      ingredients_he: '',
      is_available: true,
      category: menuCategories[0]?.slug || '',
    });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  // Global loading overlay if authorization is null
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
        <p className="text-muted text-xs font-black uppercase tracking-widest animate-pulse">Проверка доступа...</p>
      </div>
    );
  }

  // Not authorized fallback (while redirecting)
  if (!isAuthorized) {
    return null;
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <div className="bg-card border-b border-white/10 px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-all"
        >
          <div className="w-9 h-9 bg-brand/10 rounded-xl flex items-center justify-center text-xl border border-brand/20 group-hover:rotate-12 transition-transform">🍣</div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white flex flex-col leading-tight">
              MISTOR<span className="text-brand">SUSH</span>
            </h1>
            <div className="w-4 h-0.5 bg-brand rounded-full transition-all group-hover:w-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => router.push('/')}
            className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand border border-brand/20 px-3 py-2 rounded-xl hover:bg-brand hover:text-white transition-all shadow-lg shadow-brand/10">
            На сайт
          </button>
          <button onClick={loadOrders} className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors border border-white/10 px-3 py-2 rounded-xl hover:bg-white/5 md:flex hidden">
            🔄 Обновить
          </button>
          <button onClick={() => sb.auth.signOut().then(() => setIsAuthorized(false))}
            className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted hover:text-brand transition-colors border border-white/10 px-3 py-2 rounded-xl hover:bg-brand/5">
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-8 transition-all duration-500">
        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="px-4 sm:px-0 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Site Status Section */}
            <div className={`relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 group ${isSiteActive ? 'bg-card border-white/5' : 'bg-brand/5 border-brand/20'
              }`}>
              <div className={`absolute -right-16 -top-16 w-64 h-64 blur-[100px] rounded-full transition-all duration-700 ${isSiteActive ? 'bg-emerald-500/10' : 'bg-brand/10'
                }`} />

              <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-inner transition-all duration-700 ${isSiteActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand/10 text-brand'
                  }`}>
                  {isSiteActive ? '✅' : '🛑'}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                    {isSiteActive ? 'Сайт работает' : 'Сайт отключен'}
                  </h3>
                  <p className="text-muted text-sm mt-1 font-medium leading-relaxed opacity-60">
                    {isSiteActive ? 'Принимает заказы в штатном режиме' : 'Заказы временно не принимаются'}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleSiteStatus}
                disabled={statusLoading}
                className={`relative w-24 h-12 rounded-full transition-all duration-700 outline-none focus:ring-4 focus:ring-white/10 shrink-0 shadow-2xl active:scale-95 ${isSiteActive ? 'bg-emerald-500' : 'bg-brand'
                  }`}
              >
                <div className={`absolute left-1.5 top-1.5 w-9 h-9 rounded-full bg-white shadow-xl transform transition-transform duration-500 flex items-center justify-center ${isSiteActive ? 'translate-x-12' : 'translate-x-0'
                  }`}>
                  {statusLoading && (
                    <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${isSiteActive ? 'border-emerald-500' : 'border-brand'}`} />
                  )}
                </div>
              </button>
            </div>

            <div className="text-center space-y-4 py-4">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                Панель <span className="text-brand">Управления</span>
              </h2>
              <p className="text-muted text-xs md:text-sm uppercase tracking-[0.4em] font-black opacity-30">Выберите раздел для работы</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <button onClick={() => setActiveTab('orders')}
                className="group relative bg-card border border-white/5 p-10 rounded-[2.5rem] shadow-2xl hover:border-brand/40 transition-all duration-500 overflow-hidden text-left flex flex-col gap-8 active:scale-[0.98]">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand/10 blur-[80px] rounded-full group-hover:bg-brand/20 transition-all" />
                <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform duration-500 border border-brand/10">📋</div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand transition-colors">Заказы</h3>
                  <p className="text-muted text-sm mt-3 font-medium leading-relaxed opacity-60">Просмотр новых заявок, адресов доставки и состава заказов.</p>
                </div>
              </button>

              <button onClick={() => setActiveTab('products')}
                className="group relative bg-card border border-white/5 p-10 rounded-[2.5rem] shadow-2xl hover:border-brand/40 transition-all duration-500 overflow-hidden text-left flex flex-col gap-8 active:scale-[0.98]">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-all" />
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform duration-500 border border-white/5">🍱</div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand transition-colors">Меню</h3>
                  <p className="text-muted text-sm mt-3 font-medium leading-relaxed opacity-60">Управление ассортиментом: редактирование цен, названий и категорий.</p>
                </div>
              </button>

              <button onClick={() => setActiveTab('archive')}
                className="group relative bg-card border border-white/5 p-10 rounded-[2.5rem] shadow-2xl hover:border-brand/40 transition-all duration-500 overflow-hidden text-left flex flex-col gap-8 active:scale-[0.98] md:col-span-2">
                <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all" />
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform duration-500 border border-emerald-500/10">✅</div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">Архив</h3>
                  <p className="text-muted text-sm mt-3 font-medium leading-relaxed opacity-60">История всех завершенных заказов. Просмотр выполненных доставок и чеков.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* SUB-VIEW CONTENT */}
        {activeTab !== 'dashboard' && (
          <div className="animate-in fade-in duration-500 px-4 sm:px-0">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-brand transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Назад к панели
              </button>

              <div className="flex gap-1">
                {(['orders', 'products', 'archive'] as ActiveTab[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${activeTab === tab ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-transparent text-muted border-transparent hover:bg-white/5'
                      }`}>
                    {tab === 'orders' ? 'Новые' : tab === 'products' ? 'Товары' : 'Архив'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini Site Status Banner */}
            <div className="mb-8">
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${isSiteActive ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-brand/5 border-brand/20 text-brand'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isSiteActive ? 'bg-emerald-500/20' : 'bg-brand/20'
                    }`}>
                    {isSiteActive ? '✅' : '🛑'}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/90">
                    {isSiteActive ? 'Сайт работает' : 'Сайт отключен'}
                  </span>
                </div>
                <button onClick={toggleSiteStatus} disabled={statusLoading} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${isSiteActive ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-brand text-white border-brand'
                  }`}>
                  {statusLoading ? '...' : 'Переключить'}
                </button>
              </div>
            </div>

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="relative w-full max-w-sm mb-6">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск заказов..."
                    className="w-full bg-card border border-white/10 rounded-xl px-10 py-3 text-xs text-white placeholder-white/20 outline-none focus:border-brand/40 transition-all shadow-inner" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>

                <div className="flex gap-6 min-h-[60vh] w-full">
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[75vh] custom-scrollbar pr-2">
                    {loading && <p className="text-center text-muted py-8 animate-pulse">Загрузка...</p>}
                    {!loading && filteredOrders.length === 0 && (
                      <div className="text-center py-16 text-muted">
                        <div className="text-5xl mb-4 opacity-30">📭</div>
                        <p className="font-black uppercase text-[10px] tracking-widest opacity-50">Новых заказов нет</p>
                      </div>
                    )}
                    {filteredOrders.map(order => {
                      const isExpanded = selectedOrder?.id === order.id;
                      return (
                        <div key={order.id} onClick={() => setSelectedOrder(isExpanded ? null : order)}
                          className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:border-brand/30 active:scale-[0.98] ${isExpanded ? 'border-brand/40 bg-brand/5 shadow-2xl' : 'border-white/5'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted">#{order.id} • {formatDate(order.created_at)}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full ${getStatusStyle(order.status)}`}>{order.status}</span>
                          </div>
                          <div className="font-bold text-white text-sm">{order.customer_name}</div>
                          <div className="text-muted text-xs mt-0.5">{order.customer_phone}</div>
                          <div className="flex gap-3 mt-2 text-[10px] font-black uppercase tracking-widest">
                            <span className={order.order_type === 'Доставка' ? 'text-blue-400' : 'text-emerald-400'}>{order.order_type}</span>
                            <span className="text-brand">{order.total_sum}₪</span>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-fade-in">
                              {(order.delivery_address || order.comment) && (
                                <div className="space-y-2">
                                  {order.delivery_address && (
                                    <div className="text-xs text-white/70">
                                      <span className="text-[9px] uppercase font-black text-brand/50 block mb-0.5">Адрес</span>
                                      {order.delivery_address}
                                    </div>
                                  )}
                                  {order.comment && (
                                    <div className="text-xs text-white/70 italic bg-white/5 p-2 rounded-lg border border-white/5">
                                      “{order.comment}”
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="space-y-1">
                                <div className="text-[9px] uppercase font-black tracking-widest text-brand/50">Состав</div>
                                <pre className="text-white text-[11px] whitespace-pre-wrap bg-dark/50 rounded-xl p-3 border border-white/5 font-mono leading-relaxed">
                                  {order.items_json?.order_items || ''}
                                </pre>
                              </div>

                              <div className="lg:hidden space-y-2">
                                <div className="text-[9px] uppercase font-black tracking-widest text-brand/50">Статус</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {STATUS_OPTIONS.map(status => (
                                    <button key={status} onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, status); }}
                                      className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${order.status === status ? getStatusStyle(status) : 'border-white/10 text-muted'
                                        }`}>
                                      {status}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                                  className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-brand/10 border border-brand/20 text-brand rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all active:scale-95"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                  Удалить заказ
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="hidden lg:flex flex-col w-[420px] shrink-0">
                    {selectedOrder ? (
                      <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-5 sticky top-24 overflow-y-auto max-h-[75vh] custom-scrollbar">
                        <div className="flex justify-between items-center">
                          <h3 className="font-black uppercase tracking-widest text-sm">Заказ #{selectedOrder.id}</h3>
                          <button
                            onClick={() => deleteOrder(selectedOrder.id)}
                            className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-all active:scale-90"
                            title="Удалить заказ"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                        <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{formatDate(selectedOrder.created_at)}</div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Клиент</div>
                          <div className="text-white font-bold">{selectedOrder.customer_name}</div>
                          <div className="text-muted text-sm">{selectedOrder.customer_phone}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Состав</div>
                          <pre className="text-white text-xs whitespace-pre-wrap bg-dark/50 rounded-xl p-3 border border-white/5 font-mono leading-relaxed">
                            {selectedOrder.items_json?.order_items || ''}
                          </pre>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted">Итого:</span>
                          <span className="text-brand font-black text-xl">{selectedOrder.total_sum}₪</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Статус</div>
                          <div className="grid grid-cols-2 gap-2">
                            {STATUS_OPTIONS.map(status => (
                              <button key={status} onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedOrder.status === status ? getStatusStyle(status) : 'border-white/10 text-muted'
                                  }`}>
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-muted opacity-40">
                        <p className="text-[10px] uppercase font-black tracking-widest">Выберите заказ</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (() => {
              // Map slug → human-readable name (from menuCategories)
              const slugToName: Record<string, string> = Object.fromEntries(menuCategories.map(c => [c.slug, c.category]));
              const slugToEmoji: Record<string, string> = {
                'classic_rolls': '🍣', 'baked_rolls': '🔥', 'unusual_rolls': '✨',
                'burgers': '🍔', 'gunkan': '🥢', 'drinks': '🥤',
              };
              const slugToColor: Record<string, string> = {
                'classic_rolls': 'bg-[#1a1f2e] text-blue-300 border-blue-500/20',
                'baked_rolls': 'bg-[#1e1c14] text-amber-400 border-amber-500/20',
                'unusual_rolls': 'bg-[#1c1a10] text-yellow-400 border-yellow-500/20',
                'burgers': 'bg-[#1c1814] text-orange-400 border-orange-500/20',
                'gunkan': 'bg-[#141a1e] text-sky-400 border-sky-500/20',
                'drinks': 'bg-[#1a1a2a] text-purple-400 border-purple-500/20',
              };
              const displayName = (slug: string) => slugToName[slug] || slug;
              const displayEmoji = (slug: string) => slugToEmoji[slug] || '🍱';
              const displayColor = (slug: string) => slugToColor[slug] || 'bg-card text-muted border-white/10';

              const uniqueSlugs = Array.from(
                products.reduce((map, p) => {
                  if (!map.has(p.category)) map.set(p.category, true);
                  return map;
                }, new Map<string, boolean>()).keys()
              );

              const editingId = selectedProduct?.id;

              return (
                <div className="space-y-5">
                  {/* Category scroll tabs */}
                  <div className="flex flex-wrap gap-2">
                    {uniqueSlugs.map(slug => (
                      <button key={slug}
                        onClick={() => {
                          const el = document.getElementById('admin-cat-' + slug);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="px-4 py-2 rounded-2xl text-[11px] font-black tracking-widest border transition-all flex items-center gap-1.5 bg-transparent text-muted border-white/10 hover:bg-white/5 hover:text-white hover:border-brand/30">
                        <span>{displayEmoji(slug)}</span>
                        <span className="uppercase">{displayName(slug)}</span>
                      </button>
                    ))}
                  </div>

                  {/* Big add button */}
                  <button onClick={createNewProduct}
                    className="w-full py-5 bg-brand text-white font-black uppercase tracking-[0.25em] text-sm rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-brand/30 active:scale-[0.98] transition-all hover:bg-brand/90">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Добавить новый товар
                  </button>

                  {/* NEW PRODUCT FORM */}
                  {isNewProduct && selectedProduct && (
                    <div className="bg-brand/5 border-2 border-brand/30 rounded-[3rem] p-8 space-y-8 animate-fade-in relative overflow-hidden">
                      <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand/10 blur-[100px] rounded-full" />

                      <div className="flex justify-between items-center relative z-10">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Новый Товар</h2>
                        <button onClick={() => { setIsNewProduct(false); setSelectedProduct(null); }} className="text-muted hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="col-span-1 md:col-span-2 space-y-4">
                            <div className="bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all">
                              <label className="text-[9px] font-black uppercase tracking-widest text-muted/40">Название (RU / EN / HE)</label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input type="text" value={selectedProduct.name} onChange={e => setSelectedProduct({ ...selectedProduct, name: e.target.value })} placeholder="Название (RU)" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-sm pb-1" />
                                <input type="text" value={selectedProduct.name_en || ''} onChange={e => setSelectedProduct({ ...selectedProduct, name_en: e.target.value })} placeholder="Название (EN)" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-sm pb-1" />
                                <input type="text" value={selectedProduct.name_he || ''} onChange={e => setSelectedProduct({ ...selectedProduct, name_he: e.target.value })} placeholder="Название (HE)" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-sm pb-1" dir="rtl" />
                              </div>
                            </div>

                            <div className="bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all">
                              <label className="text-[9px] font-black uppercase tracking-widest text-muted/40">Ингредиенты (RU / EN / HE)</label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <textarea value={selectedProduct.ingredients || ''} onChange={e => setSelectedProduct({ ...selectedProduct, ingredients: e.target.value })} placeholder="Ингредиенты (RU)" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-xs pb-1 min-h-[40px] resize-y" />
                                <textarea value={selectedProduct.ingredients_en || ''} onChange={e => setSelectedProduct({ ...selectedProduct, ingredients_en: e.target.value })} placeholder="Ингредиенты (EN)" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-xs pb-1 min-h-[40px] resize-y" />
                                <textarea value={selectedProduct.ingredients_he || ''} onChange={e => setSelectedProduct({ ...selectedProduct, ingredients_he: e.target.value })} placeholder="Ингредиенты (HE)" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-xs pb-1 min-h-[40px] resize-y" dir="rtl" />
                              </div>
                            </div>
                          </div>

                          <div className="bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted/40">Цена</label>
                            <div className="flex items-center gap-2">
                              <input type="number"
                                value={selectedProduct.price}
                                onChange={e => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                                className="w-full bg-transparent border-none outline-none font-black text-brand text-2xl"
                              />
                              <span className="text-white/20 font-black text-xl italic uppercase">₪</span>
                            </div>
                          </div>

                          <div className="bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted/40">Категория</label>
                            <div className="flex items-center gap-2">
                              <span className="text-xl shrink-0 opacity-60">{displayEmoji(selectedProduct.category)}</span>
                              <select
                                value={selectedProduct.category}
                                onChange={e => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                                className="w-full bg-transparent border-none outline-none font-black text-white text-[11px] uppercase tracking-widest cursor-pointer p-0"
                              >
                                {menuCategories.map(m => (
                                  <option key={m.slug} value={m.slug} className="bg-card text-white">{m.category}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Upload for New Product */}
                          <div className="col-span-1 md:col-span-2 bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all cursor-pointer relative"
                            onClick={() => document.getElementById('upload-input-new')?.click()}>
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted/40 flex justify-between">
                              Загрузить фото
                              {isUploading && <span className="text-brand animate-pulse">Загрузка...</span>}
                            </label>

                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-muted overflow-hidden shrink-0 shadow-lg transition-all group-hover:border-brand/30">
                                {(selectedProduct.image_url) ? (
                                  <img src={resolveImagePath(selectedProduct.image_url, selectedProduct.category) || ''} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 opacity-30">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 overflow-hidden min-w-0">
                                <div className="text-[12px] text-white/40 truncate font-mono italic block w-full">
                                  {resolveImagePath(selectedProduct.image_url, selectedProduct.category) || 'Нажмите для выбора файла...'}
                                </div>
                              </div>
                            </div>

                            <input
                              type="file"
                              id="upload-input-new"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, selectedProduct!);
                                e.target.value = '';
                              }}
                            />
                          </div>
                        </div>

                        <button onClick={saveProduct} disabled={!selectedProduct.name}
                          className="w-full py-5 bg-white text-dark font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-brand hover:text-white shadow-2xl active:scale-95 disabled:opacity-30 uppercase text-xs tracking-[0.3em]">
                          Создать и Опубликовать
                        </button>
                      </div>
                    </div>
                  )}

                  {/* All categories — grouped from actual Supabase data */}
                  {products.length === 0 && !isNewProduct && (
                    <div className="text-center py-16 text-muted opacity-40">
                      <p className="text-[11px] uppercase font-black tracking-widest">Загрузка товаров...</p>
                    </div>
                  )}
                  {uniqueSlugs.map(slug => {
                    const catProducts = products.filter(p => p.category === slug);
                    if (catProducts.length === 0) return null;
                    return (
                      <div key={slug} id={'admin-cat-' + slug} className="space-y-6">
                        {/* Section title */}
                        <div className="flex items-center gap-4 pt-8">
                          <div className="flex-1 h-px bg-white/5" />
                          <h2 className="font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2 text-muted">
                            <span>{displayEmoji(slug)}</span>
                            {displayName(slug)}
                          </h2>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <div className="grid gap-6">
                          {catProducts.map(product => {
                            const isEditing = editingId === product.id && !isNewProduct;
                            const currentProduct = isEditing ? selectedProduct : product;

                            return (
                              <div key={product.id} className="bg-card border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 transition-all shadow-2xl relative group">
                                {/* Top background glow */}
                                <div className={`absolute -right-16 -top-16 w-48 h-48 blur-[80px] rounded-full transition-all opacity-20 pointer-events-none group-hover:opacity-30 ${product.is_available ? 'bg-emerald-500/30' : 'bg-brand/30'
                                  }`} />

                                <div className="p-6 relative z-10 space-y-5">
                                  {/* Header: Buttons first for Top on Mobile, Right on Desktop */}
                                  <div className="flex flex-col sm:flex-row-reverse justify-between items-start gap-4 sm:gap-6 cursor-pointer w-full" onClick={(e) => {
                                    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('textarea') || (e.target as HTMLElement).closest('select')) return;
                                    if (isEditing) {
                                      setSelectedProduct(null);
                                    } else {
                                      setSelectedProduct(product);
                                      setIsNewProduct(false);
                                    }
                                  }}>
                                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0">
                                      <button
                                        onClick={async () => {
                                          if (isEditing) { await saveProduct(); }
                                          else { setSelectedProduct(product); setIsNewProduct(false); }
                                        }}
                                        className="w-11 h-11 rounded-2xl bg-brand text-white flex items-center justify-center shadow-xl shadow-brand/20 active:scale-90 transition-all hover:bg-brand/80"
                                      >
                                        {isEditing ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                          </svg>
                                        ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                          </svg>
                                        )}
                                      </button>
                                      {isEditing && (
                                        <button
                                          onClick={() => setSelectedProduct(null)}
                                          className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-muted flex items-center justify-center shadow-xl active:scale-90 transition-all hover:bg-white/10 hover:text-white"
                                          title="Свернуть"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                          </svg>
                                        </button>
                                      )}
                                      <button
                                        onClick={() => toggleProductAvailability(product)}
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all shrink-0 ${product.is_available
                                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                                            : 'bg-brand/10 border border-brand/20 text-brand hover:bg-brand/20'
                                          }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                          {product.is_available ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.412 8.352 7.244 5.5 12 5.5s8.588 2.852 9.964 6.178c.118.285.118.592 0 .877C20.588 15.648 16.756 18.5 12 18.5s-8.588-2.852-9.964-6.178Z" />
                                          ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                          )}
                                        </svg>
                                      </button>
                                      {confirmDeleteId === product.id ? (
                                        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                                          <button
                                            onClick={() => { deleteProductAdmin(product); setConfirmDeleteId(null); }}
                                            className="h-11 px-4 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-xl active:scale-90 transition-all font-black text-[10px] uppercase"
                                          >
                                            Да
                                          </button>
                                          <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="w-11 h-11 rounded-2xl bg-white/10 border border-white/5 text-white flex items-center justify-center shadow-xl active:scale-90 transition-all"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setConfirmDeleteId(product.id)}
                                          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all shrink-0 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
                                          title="Удалить товар"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>

                                    <div className="flex-1 w-full space-y-1">
                                      {isEditing ? (
                                        <div className="space-y-3 pb-3">
                                          <div className="bg-dark/40 border border-white/5 rounded-xl p-3">
                                            <label className="text-[9px] uppercase tracking-widest text-muted/40 mb-2 block">Название (RU / EN / HE)</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                              <input type="text" value={selectedProduct.name} onChange={e => setSelectedProduct({ ...selectedProduct, name: e.target.value })} placeholder="RU" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-sm pb-1 font-bold" />
                                              <input type="text" value={selectedProduct.name_en || ''} onChange={e => setSelectedProduct({ ...selectedProduct, name_en: e.target.value })} placeholder="EN" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-sm pb-1 font-bold" />
                                              <input type="text" value={selectedProduct.name_he || ''} onChange={e => setSelectedProduct({ ...selectedProduct, name_he: e.target.value })} placeholder="HE" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-sm pb-1 font-bold" dir="rtl" />
                                            </div>
                                          </div>
                                          <div className="bg-dark/40 border border-white/5 rounded-xl p-3">
                                            <label className="text-[9px] uppercase tracking-widest text-muted/40 mb-2 block">Ингредиенты (RU / EN / HE)</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                              <textarea value={selectedProduct.ingredients || ''} onChange={e => setSelectedProduct({ ...selectedProduct, ingredients: e.target.value })} placeholder="RU" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-xs pb-1 min-h-[40px] resize-y" />
                                              <textarea value={selectedProduct.ingredients_en || ''} onChange={e => setSelectedProduct({ ...selectedProduct, ingredients_en: e.target.value })} placeholder="EN" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-xs pb-1 min-h-[40px] resize-y" />
                                              <textarea value={selectedProduct.ingredients_he || ''} onChange={e => setSelectedProduct({ ...selectedProduct, ingredients_he: e.target.value })} placeholder="HE" className="w-full bg-transparent border-b border-white/10 outline-none text-white text-xs pb-1 min-h-[40px] resize-y" dir="rtl" />
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="font-black text-white text-lg md:text-xl leading-tight tracking-tight uppercase italic break-words w-full">{product.name}</div>
                                      )}
                                      <div className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${product.is_available ? 'text-emerald-400' : 'text-brand'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${product.is_available ? 'bg-emerald-400 animate-pulse' : 'bg-brand'}`} />
                                        {product.is_available ? 'Виден в меню' : 'Скрыт от клиентов'}
                                      </div>
                                    </div>
                                  </div>

                                  {isEditing && (
                                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-white/5 pt-5 mt-5">
                                      <div className="bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted/40">Цена</label>
                                        <div className="flex items-center gap-2">
                                          <input type="number"
                                            value={currentProduct?.price ?? 0}
                                            onChange={e => {
                                              if (!isEditing) { setSelectedProduct(product); setIsNewProduct(false); }
                                              setSelectedProduct(prev => prev ? { ...prev, price: Number(e.target.value) } : null);
                                            }}
                                            onFocus={() => { if (!isEditing) { setSelectedProduct(product); setIsNewProduct(false); } }}
                                            className="w-full bg-transparent border-none outline-none font-black text-brand text-2xl p-0 focus:text-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <span className="text-white/20 font-black text-xl italic uppercase">₪</span>
                                        </div>
                                      </div>

                                      <div className="bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted/40">Категория</label>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xl shrink-0 opacity-60">{displayEmoji(currentProduct?.category || '')}</span>
                                          <select
                                            value={currentProduct?.category || ''}
                                            onChange={e => {
                                              if (!isEditing) { setSelectedProduct(product); setIsNewProduct(false); }
                                              setSelectedProduct(prev => prev ? { ...prev, category: e.target.value } : null);
                                            }}
                                            onFocus={() => { if (!isEditing) { setSelectedProduct(product); setIsNewProduct(false); } }}
                                            className="w-full bg-transparent border-none outline-none font-black text-white text-[11px] uppercase tracking-widest cursor-pointer p-0"
                                          >
                                            {menuCategories.map(m => (
                                              <option key={m.slug} value={m.slug} className="bg-card text-white">{m.category}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>

                                      <div className="col-span-2 bg-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:border-brand/40 transition-all cursor-pointer relative"
                                        onClick={() => document.getElementById(`upload-input-${product.id}`)?.click()}>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted/40 flex justify-between">
                                          Загрузить фото
                                          {isUploading && <span className="text-brand animate-pulse">Загрузка...</span>}
                                        </label>

                                        <div className="flex items-center gap-4 min-w-0">
                                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-muted overflow-hidden shrink-0 shadow-lg transition-all group-hover:border-brand/30">
                                            {(currentProduct?.image_url) ? (
                                              <img src={resolveImagePath(currentProduct.image_url, product.category) || ''} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 opacity-30">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                              </svg>
                                            )}
                                          </div>
                                          <div className="flex-1 overflow-hidden min-w-0">
                                            <div className="text-[11px] text-white/40 truncate font-mono italic block w-full">
                                              {resolveImagePath(currentProduct?.image_url, product.category) || 'Нажмите для выбора файла...'}
                                            </div>
                                          </div>
                                        </div>

                                        <input
                                          type="file"
                                          id={`upload-input-${product.id}`}
                                          className="hidden"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, isEditing ? selectedProduct! : product);
                                            e.target.value = '';
                                          }}
                                        />
                                        {isEditing && saveMessage && (
                                          <div className="absolute right-4 bottom-4 px-3 py-1 bg-brand/10 rounded-full border border-brand/20">
                                            <span className="text-brand text-[8px] font-black uppercase">{saveMessage}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}



            {/* ARCHIVE TAB */}
            {activeTab === 'archive' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="font-black uppercase tracking-widest text-sm">Архив ({filteredArchive.length})</h2>
                  <div className="flex gap-2">
                    {(['today', 'week', 'month', 'all'] as const).map(p => (
                      <button key={p} onClick={() => setArchiveFilter(p)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${archiveFilter === p ? 'bg-white/10 text-white' : 'text-muted'
                        }`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredArchive.map(order => {
                    const isExpanded = selectedOrder?.id === order.id;
                    return (
                      <div key={order.id} onClick={() => setSelectedOrder(isExpanded ? null : order)}
                        className={`bg-card border rounded-2xl p-4 transition-all cursor-pointer ${isExpanded ? 'border-brand/40 bg-brand/5 shadow-2xl' : 'border-white/5'}`}>
                        <div className="flex justify-between items-center group">
                          <div>
                            <div className="text-[10px] font-black text-muted uppercase">#{order.id} • {formatDate(order.created_at)}</div>
                            <div className="font-bold text-white">{order.customer_name}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="font-black text-emerald-400">{order.total_sum}₪</div>
                            {!isExpanded && (
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                                className="w-8 h-8 rounded-lg bg-brand/5 border border-brand/20 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                                title="Удалить из архива"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <div className="text-[9px] uppercase font-black tracking-widest text-brand/50">Телефон</div>
                                <div className="text-white text-xs">{order.customer_phone}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] uppercase font-black tracking-widest text-brand/50">Тип</div>
                                <div className="text-white text-xs">{order.order_type}</div>
                              </div>
                            </div>

                            {(order.delivery_address || order.comment) && (
                              <div className="space-y-2">
                                {order.delivery_address && (
                                  <div className="text-xs text-white/70">
                                    <span className="text-[9px] uppercase font-black text-brand/50 block mb-0.5">Адрес</span>
                                    {order.delivery_address}
                                  </div>
                                )}
                                {order.comment && (
                                  <div className="text-xs text-white/70 italic bg-white/5 p-2 rounded-lg border border-white/5">
                                    “{order.comment}”
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="space-y-1">
                              <div className="text-[9px] uppercase font-black tracking-widest text-brand/50">Состав</div>
                              <pre className="text-white text-[11px] whitespace-pre-wrap bg-dark/50 rounded-xl p-3 border border-white/5 font-mono leading-relaxed">
                                {order.items_json?.order_items || ''}
                              </pre>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); restoreOrder(order); }}
                                className="flex-1 py-3 flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                </svg>
                                Вернуть в заказы
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                                className="py-3 px-4 flex items-center justify-center gap-2 bg-brand/5 border border-brand/20 text-brand rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all active:scale-95"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ScrollTopButton />
    </div>
  );
}
