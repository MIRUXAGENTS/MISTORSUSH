'use client';

import { useState, useEffect, useCallback } from 'react';
import { sb } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { menuData } from '@/lib/menuData';

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
  id: number;
  item_id: string;
  name: string;
  name_en: string;
  price: number;
  ingredients: string;
  ingredients_en: string;
  is_available: boolean;
  category: string;
  image_url?: string;
}

type ActiveTab = 'orders' | 'products' | 'archive';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [archive, setArchive] = useState<Order[]>([]);
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const ADMIN_EMAILS = ['mistorsush@gmail.com', 'vladislav.chistov1337@gmail.com', 'admin@mistorsush.com'];

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user && ADMIN_EMAILS.includes(user.email || '')) setIsAuthorized(true);
    });
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadOrders();
      loadProducts();
    }
  }, [isAuthorized]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) throw error;
      const user = data.user;
      if (user && ADMIN_EMAILS.includes(user.email || '')) {
        setCurrentUser(user);
        setIsAuthorized(true);
      } else {
        await sb.auth.signOut();
        setAuthError('Доступ запрещен. Нет прав администратора.');
      }
    } catch (err: unknown) {
      setAuthError((err as Error).message || 'Ошибка авторизации');
    } finally {
      setAuthLoading(false);
    }
  }

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from('orders').select('*').neq('status', 'Завершен').order('created_at', { ascending: false });
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
    const { data } = await sb.from('products').select('*').order('id');
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

  async function toggleProductAvailability(product: SupabaseProduct) {
    const newVal = !product.is_available;
    await sb.from('products').update({ is_available: newVal }).eq('id', product.id);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_available: newVal } : p));
  }

  async function saveProduct() {
    if (!selectedProduct) return;
    setSaveMessage('Сохраняем...');
    if (isNewProduct) {
      const { error } = await sb.from('products').insert([selectedProduct]);
      if (error) { setSaveMessage('Ошибка: ' + error.message); return; }
    } else {
      const { error } = await sb.from('products').update(selectedProduct).eq('id', selectedProduct.id);
      if (error) { setSaveMessage('Ошибка: ' + error.message); return; }
    }
    setSaveMessage('Сохранено!');
    await loadProducts();
    setTimeout(() => setSaveMessage(''), 2000);
    setSelectedProduct(null);
    setIsNewProduct(false);
  }

  function createNewProduct() {
    setIsNewProduct(true);
    setSelectedProduct({
      id: 0,
      item_id: '',
      name: '',
      name_en: '',
      price: 0,
      ingredients: '',
      ingredients_en: '',
      is_available: true,
      category: menuData[0]?.category || '',
    });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  // Auth screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand/10 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand/5 blur-[100px] rounded-full animate-pulse" />
        </div>
        <div className="w-full max-w-md bg-card border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl border border-brand/20">🍣</div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">
              MISTOR<span className="text-brand">SUSH</span>
            </h1>
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-60">Admin Security Layer</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted ml-1">Email</label>
              <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required placeholder="admin@example.com"
                className="w-full bg-dark/50 border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-brand/50 outline-none transition-all placeholder:text-white/5 text-white font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted ml-1">Пароль</label>
              <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required placeholder="••••••••"
                className="w-full bg-dark/50 border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-brand/50 outline-none transition-all placeholder:text-white/5 text-white font-medium" />
            </div>
            {authError && <p className="text-brand text-xs font-bold text-center">{authError}</p>}
            <button type="submit" disabled={authLoading}
              className="w-full py-4 bg-white text-dark font-black rounded-xl hover:bg-brand hover:text-white transition-all active:scale-[0.98] shadow-xl uppercase text-xs tracking-[0.2em] disabled:opacity-60">
              {authLoading ? '...' : 'Войти в панель'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <div className="bg-card border-b border-white/10 px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand/10 rounded-xl flex items-center justify-center text-xl border border-brand/20">🍣</div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-white">Admin Panel</h1>
            <p className="text-[10px] text-muted font-bold">{currentUser?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadOrders} className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors border border-white/10 px-3 py-2 rounded-xl hover:bg-white/5">
            🔄 Обновить
          </button>
          <button onClick={() => sb.auth.signOut().then(() => setIsAuthorized(false))}
            className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-brand transition-colors border border-white/10 px-3 py-2 rounded-xl hover:bg-brand/5">
            Выйти
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 sm:px-8 pt-6 pb-0">
        {(['orders', 'products', 'archive'] as ActiveTab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-t-xl text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
              activeTab === tab
                ? 'text-brand border-brand bg-brand/5'
                : 'text-muted border-transparent hover:text-white hover:bg-white/5'
            }`}>
            {tab === 'orders' ? `📋 Заказы (${orders.length})` : tab === 'products' ? '🍱 Продукты' : '🗂️ Архив'}
          </button>
        ))}
      </div>

      <div className="px-4 sm:px-8 py-6">
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="flex gap-6 min-h-[60vh]">
            {/* Orders list */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[75vh] custom-scrollbar pr-2">
              {loading && <p className="text-center text-muted py-8 animate-pulse">Загрузка...</p>}
              {!loading && orders.length === 0 && (
                <div className="text-center py-16 text-muted">
                  <div className="text-5xl mb-4 opacity-30">📭</div>
                  <p className="font-black uppercase text-[10px] tracking-widest opacity-50">Новых заказов нет</p>
                </div>
              )}
              {orders.map(order => (
                <div key={order.id} onClick={() => setSelectedOrder(order)}
                  className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:border-brand/30 active:scale-[0.98] ${selectedOrder?.id === order.id ? 'border-brand/40 bg-brand/5' : 'border-white/5'}`}>
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
                </div>
              ))}
            </div>

            {/* Order detail panel */}
            <div className="hidden lg:flex flex-col w-[420px] shrink-0">
              {selectedOrder ? (
                <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-5 sticky top-24 overflow-y-auto max-h-[75vh] custom-scrollbar">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black uppercase tracking-widest text-sm">Заказ #{selectedOrder.id}</h3>
                    <button onClick={() => deleteOrder(selectedOrder.id)} className="text-[9px] text-brand/70 hover:text-brand font-black uppercase tracking-widest border border-brand/20 px-2 py-1 rounded-lg hover:bg-brand/5 transition-colors">✕ Удалить</button>
                  </div>
                  <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{formatDate(selectedOrder.created_at)}</div>

                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Клиент</div>
                    <div className="text-white font-bold">{selectedOrder.customer_name}</div>
                    <div className="text-muted text-sm">{selectedOrder.customer_phone}</div>
                    {selectedOrder.customer_email && <div className="text-muted text-xs">{selectedOrder.customer_email}</div>}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Доставка</div>
                    <div className="text-white text-sm font-bold">{selectedOrder.order_type}</div>
                    {selectedOrder.delivery_address !== 'Самовывоз' && <div className="text-muted text-xs">{selectedOrder.delivery_address}</div>}
                    <div className="text-muted text-xs">⏰ {selectedOrder.delivery_time || 'ASAP'}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Состав заказа</div>
                    <pre className="text-white text-xs whitespace-pre-wrap bg-dark/50 rounded-xl p-3 border border-white/5 font-mono leading-relaxed">
                      {selectedOrder.items_json?.order_items || ''}
                    </pre>
                  </div>

                  {selectedOrder.comment && (
                    <div className="space-y-1">
                      <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Комментарий</div>
                      <div className="text-muted text-sm italic bg-dark/50 rounded-xl p-3 border border-white/5">{selectedOrder.comment}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] uppercase font-black tracking-widest text-muted">Итого:</span>
                    <span className="text-brand font-black text-xl">{selectedOrder.total_sum}₪</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[9px] uppercase font-black tracking-widest text-brand/70">Статус заказа</div>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.map(status => (
                        <button key={status} onClick={() => updateOrderStatus(selectedOrder.id, status)}
                          className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                            selectedOrder.status === status
                              ? getStatusStyle(status) + ' ring-1 ring-brand/30'
                              : 'border-white/10 text-muted hover:bg-white/5'
                          }`}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted opacity-40">
                  <div className="text-center">
                    <div className="text-5xl mb-3">👈</div>
                    <p className="text-[10px] uppercase font-black tracking-widest">Выберите заказ</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black uppercase tracking-widest text-sm">Управление продуктами ({products.length})</h2>
              <button onClick={createNewProduct} className="bg-brand text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl active:scale-95 transition-all shadow-lg shadow-brand/20">
                + Добавить
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-card border border-white/5 rounded-2xl p-4 space-y-3 hover:border-brand/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-white">{product.name}</div>
                      <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-0.5">{product.category}</div>
                    </div>
                    <span className="font-black text-brand">{product.price}₪</span>
                  </div>
                  <div className="text-xs text-muted line-clamp-2 opacity-70">{product.ingredients}</div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleProductAvailability(product)}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                        product.is_available ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-brand/10 border-brand/30 text-brand'
                      }`}>
                      {product.is_available ? '✓ Доступен' : '✕ Нет в наличии'}
                    </button>
                    <button onClick={() => { setSelectedProduct(product); setIsNewProduct(false); }}
                      className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 text-muted hover:text-white hover:bg-white/5 transition-all">
                      Ред.
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit product panel */}
            {selectedProduct && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-dark border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                  <div className="flex justify-between items-center p-5 border-b border-white/10">
                    <h3 className="font-black uppercase tracking-widest text-sm">{isNewProduct ? 'Новый продукт' : 'Редактировать'}</h3>
                    <button onClick={() => setSelectedProduct(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { label: 'ID позиции', key: 'item_id', type: 'text' },
                      { label: 'Название (RU)', key: 'name', type: 'text' },
                      { label: 'Name (EN)', key: 'name_en', type: 'text' },
                      { label: 'Цена (₪)', key: 'price', type: 'number' },
                      { label: 'Состав (RU)', key: 'ingredients', type: 'text' },
                      { label: 'Ingredients (EN)', key: 'ingredients_en', type: 'text' },
                      { label: 'Категория', key: 'category', type: 'text' },
                      { label: 'URL картинки', key: 'image_url', type: 'text' },
                    ].map(({ label, key, type }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{label}</label>
                        <input
                          type={type}
                          value={String((selectedProduct as unknown as Record<string, unknown>)[key] ?? '')}
                          onChange={e => setSelectedProduct(prev => prev ? { ...prev, [key]: type === 'number' ? Number(e.target.value) : e.target.value } : null)}
                          className="w-full bg-card border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand transition text-sm"
                        />
                      </div>
                    ))}
                    <div className="flex items-center gap-3 py-2">
                      <button onClick={() => setSelectedProduct(prev => prev ? { ...prev, is_available: !prev.is_available } : null)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          selectedProduct.is_available ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-brand/10 border-brand/30 text-brand'
                        }`}>
                        {selectedProduct.is_available ? '✓ Доступен' : '✕ Недоступен'}
                      </button>
                    </div>
                    {saveMessage && <p className="text-center text-brand text-xs font-bold">{saveMessage}</p>}
                    <button onClick={saveProduct} className="w-full bg-brand text-white font-black py-3 rounded-xl active:scale-[0.98] transition shadow-lg shadow-brand/20 uppercase text-xs tracking-widest">
                      Сохранить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ARCHIVE TAB */}
        {activeTab === 'archive' && (
          <div className="max-w-4xl">
            <h2 className="font-black uppercase tracking-widest text-sm mb-6">Архив завершённых заказов ({archive.length})</h2>
            {loading ? (
              <p className="text-center text-muted py-8 animate-pulse">Загрузка...</p>
            ) : (
              <div className="space-y-3">
                {archive.map(order => (
                  <div key={order.id} className="bg-card border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-emerald-500/20 transition-colors">
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">#{order.id}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="font-bold text-white text-sm">{order.customer_name} • {order.customer_phone}</div>
                      <div className="text-xs text-muted line-clamp-1 opacity-70">{(order.items_json?.order_items || '').split('\n')[0]}...</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-black text-emerald-400 text-lg">{order.total_sum}₪</span>
                      <button onClick={() => deleteOrder(order.id)} className="text-[9px] text-brand/60 hover:text-brand font-black uppercase tracking-widest border border-brand/20 px-2 py-1.5 rounded-lg hover:bg-brand/5 transition-colors">
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
                {archive.length === 0 && (
                  <div className="text-center py-16 text-muted opacity-40">
                    <div className="text-5xl mb-4">🗂️</div>
                    <p className="font-black uppercase text-[10px] tracking-widest">Архив пуст</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
