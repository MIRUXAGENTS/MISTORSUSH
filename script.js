let cart = {}; 
let currentLang = localStorage.getItem('lang') || 'ru';
let currentCategoryView = 0;

const i18n = {
    ru: {
        subtitle: "Суши в Ашкелоне",
        workingHours: "Работаем по предварительным заказам",
        openEveryday: "Open Everyday 12:00 - 00:00",
        promoTitle: "Акция Пятницы!",
        promoDesc: "Все запеченные роллы",
        cartEmpty: "Ваша корзина пуста :(",
        cartEmptySub: "Добавьте роллы, чтобы сделать заказ",
        inCart: "В корзине",
        pcs: "шт",
        orderBtn: "Заказать",
        myCart: "Моя корзина",
        total: "Итого:",
        totalToPay: "Итого к оплате:",
        checkoutBtn: "Оформить заказ",
        continueBtn: "Продолжить покупки",
        checkoutTitle: "Оформление",
        delivery: "Доставка",
        pickup: "Самовывоз",
        nameField: "Имя и Фамилия",
        namePlaceholder: "Иван Иванов",
        phoneField: "Номер телефона",
        addressTitle: "Адрес доставки",
        addressBadge: "от 250₪ - 0₪",
        courierFee: "Услуга курьера:",
        freeDeliveryNotice: "При заказе от 250₪ доставка БЕСПЛАТНАЯ!",
        addressField: "Город, Улица и Дом",
        addressPlaceholder: "Ашкелон, ул. Бен Гурион 12",
        aptField: "Квартира",
        floorField: "Этаж",
        entranceField: "Подъезд",
        commentField: "Комментарий к заказу",
        commentPlaceholder: "Например, без лука, позвонить за 5 минут...",
        sendWhatsapp: "Отправить в WhatsApp",
        subtotal: "Сумма заказа:",
        discount2plus1: "Скидка 2+1:",
        deliveryCostLabel: "Доставка:",
        promo2plus1Popup: "Акция 2+1 (Пятница):",
        free: "Бесплатно!",
        freeKitBanner: "К каждому набору роллов: соя, терияки, васаби и имбирь — ",
        freeUpper: "БЕСПЛАТНО!",
        freeKitCartName: "Набор специй (Соя, терияки, васаби, имбирь)",
        whatsappOrderTitle: "*Ваш заказ:*",
        whatsappComment: "💬 *Комментарий:*",
        whatsappDelivery: "🛵 *Доставка:*",
        whatsappPromo: "🎁 *Акция 2+1 (Пятница):*",
        whatsappTotal: "💰 *Итого к оплате:*",
        whatsappPickup: "🛒 *Самовывоз*",
        whatsappAddress: "📍 *Адрес:*",
        whatsappApt: "Кв.",
        whatsappFloor: "Этаж",
        whatsappEnt: "Подъезд"
    },
    en: {
        subtitle: "Sushi in Ashkelon",
        workingHours: "Pre-orders only",
        openEveryday: "Open Everyday 12:00 - 00:00",
        promoTitle: "Friday Promo!",
        promoDesc: "All baked rolls",
        cartEmpty: "Your cart is empty :(",
        cartEmptySub: "Add rolls to place an order",
        inCart: "In cart",
        pcs: "pcs",
        orderBtn: "Order",
        myCart: "My Cart",
        total: "Total:",
        totalToPay: "Total to pay:",
        checkoutBtn: "Checkout",
        continueBtn: "Continue shopping",
        checkoutTitle: "Checkout",
        delivery: "Delivery",
        pickup: "Pickup",
        nameField: "Full Name",
        namePlaceholder: "John Doe",
        phoneField: "Phone Number",
        addressTitle: "Delivery Address",
        addressBadge: "from 250₪ - 0₪",
        courierFee: "Courier fee:",
        freeDeliveryNotice: "Free delivery for orders over 250₪!",
        addressField: "City, Street and House",
        addressPlaceholder: "Ashkelon, Ben Gurion St 12",
        aptField: "Apt",
        floorField: "Floor",
        entranceField: "Entrance",
        commentField: "Order Comment",
        commentPlaceholder: "e.g., no onion, call 5 mins before...",
        sendWhatsapp: "Send to WhatsApp",
        subtotal: "Subtotal:",
        discount2plus1: "2+1 Discount:",
        deliveryCostLabel: "Delivery:",
        promo2plus1Popup: "Friday 2+1 Promo:",
        free: "Free!",
        freeKitBanner: "With every roll: soy, teriyaki, wasabi and ginger — ",
        freeUpper: "FREE!",
        freeKitCartName: "Sauce Kit (Soy, teriyaki, wasabi, ginger)",
        whatsappOrderTitle: "*Your Order:*",
        whatsappComment: "💬 *Comment:*",
        whatsappDelivery: "🛵 *Delivery:*",
        whatsappPromo: "🎁 *Friday 2+1 Promo:*",
        whatsappTotal: "💰 *Total to pay:*",
        whatsappPickup: "🛒 *Pickup*",
        whatsappAddress: "📍 *Address:*",
        whatsappApt: "Apt.",
        whatsappFloor: "Floor",
        whatsappEnt: "Ent."
    }
};

function applyLanguage() {
    document.documentElement.lang = currentLang;
    const btn = document.getElementById('langBtn');
    if (btn) btn.textContent = currentLang === 'ru' ? 'RU' : 'EN';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            el.textContent = i18n[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[currentLang][key]) {
            el.placeholder = i18n[currentLang][key];
        }
    });
}

function toggleLang() {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', currentLang);
    applyLanguage();
    renderNav();
    selectCategory(currentCategoryView);
    updateCartWidget();
    if (!document.getElementById('cartModal').classList.contains('opacity-0')) renderCartModalItems();
    if (!document.getElementById('checkoutModal').classList.contains('opacity-0')) updateCheckoutSummary();
}

function init() {
    applyLanguage();
    renderNav();
    renderDrawer();
    selectCategory(0);
    updateCartWidget();
}

function renderNav() {
    const nav = document.getElementById('categoryNav');
    nav.innerHTML = menuData.map((cat, index) => {
        const isActive = index === currentCategoryView;
        const activeClass = isActive ? 'text-brand border-brand/30 bg-brand/10' : 'text-muted border-white/5 bg-card hover:bg-white/5';
        return `
        <button onclick="selectCategory(${index})" class="category-link whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${activeClass}">
            ${currentLang === 'en' ? cat.categoryEn : cat.category}
        </button>
        `;
    }).join('');
}

function renderMenu() {
    const container = document.getElementById('menuContainer');
    const cat = menuData[currentCategoryView];
    if (!cat) return;

    const isClassic = currentCategoryView === 0;
    const isBaked = currentCategoryView === 1;
    const isDrinks = currentCategoryView === 2;
    const isSauces = currentCategoryView === 3;
    
    let cardBgColor = 'bg-card';
    let cardBorderColor = 'border-white/5';
    
    if (isClassic) {
        cardBgColor = 'bg-[#12141a]';
        cardBorderColor = 'border-[#1e2330]';
    } else if (isBaked) {
        cardBgColor = 'bg-[#1c1814]';
        cardBorderColor = 'border-[#2e2620]';
    } else if (isDrinks) {
        cardBgColor = 'bg-[#2a2d39]';
        cardBorderColor = 'border-[#3a3e4c]';
    } else if (isSauces) {
        cardBgColor = 'bg-[#211616]';
        cardBorderColor = 'border-[#3b2323]';
    }

    if (cat.items.length === 0) {
        container.innerHTML = `
        <section id="cat-${currentCategoryView}" class="menu-section animate-fade-in">
            <h2 class="text-2xl font-bold mb-6 tracking-tight text-white/95 flex items-center justify-center gap-4 text-center uppercase text-[22px]">
                <div class="h-px bg-white/10 flex-grow"></div>
                ${currentLang === 'en' ? cat.categoryEn : cat.category}
                <div class="h-px bg-white/10 flex-grow"></div>
            </h2>
            <div class="text-center py-16 text-muted bg-card/50 rounded-2xl border border-white/5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 opacity-20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p class="font-medium tracking-wider text-sm uppercase">Пока пусто</p>
                <p class="text-xs opacity-50 mt-1">Скоро мы добавим сюда товары</p>
            </div>
        </section>
        `;
        return;
    }

    container.innerHTML = `
    <section id="cat-${currentCategoryView}" class="menu-section animate-fade-in">
        <h2 class="text-2xl font-bold mb-6 tracking-tight text-white/95 flex items-center justify-center gap-4 text-center uppercase text-[22px]">
            <div class="h-px bg-white/10 flex-grow"></div>
            ${currentLang === 'en' ? cat.categoryEn : cat.category}
            <div class="h-px bg-white/10 flex-grow"></div>
        </h2>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            ${cat.items.map(item => `
                <div class="product-card flex flex-col justify-between ${cardBgColor} p-4 rounded-2xl border ${cardBorderColor} shadow-lg shadow-black/30">
                    ${item.image ? `<div class="w-full flex justify-center mb-3"><img src="${item.image}" alt="${item.name}" class="h-28 object-contain drop-shadow-md"></div>` : ''}
                    <div class="mb-3">
                        <h3 class="font-bold text-[17px] leading-snug mb-1.5 text-white/95">${currentLang === 'en' ? item.nameEn : item.name}</h3>
                        <p class="text-xs text-muted leading-relaxed line-clamp-3">${currentLang === 'en' ? item.ingredientsEn : item.ingredients}</p>
                    </div>
                    <div class="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
                        <span class="font-bold text-lg text-brand">${item.price}₪</span>
                        <div class="cart-controls" id="controls-${item.id}">
                            <button class="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition shadow-lg shadow-brand/30" onclick="addToCart('${item.id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    `;
}

function renderDrawer() {
    const container = document.getElementById('drawerLinks');
    if (!container) return;
    
    container.innerHTML = menuData.map((cat, index) => {
        const isActive = index === currentCategoryView;
        const activeClass = isActive ? 'bg-brand/10 text-brand border-brand/30' : 'bg-transparent text-white/80 border-transparent hover:bg-white/5';
        return `
        <button onclick="selectCategory(${index})" class="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${activeClass}">
            <span class="font-semibold text-sm tracking-wide uppercase">${currentLang === 'en' ? cat.categoryEn : cat.category}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 group-hover:translate-x-1 transition-all"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        </button>
        `;
    }).join('');
}

function selectCategory(index) {
    currentCategoryView = index;
    renderNav();
    renderMenu();
    renderDrawer();
    closeDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openDrawer() {
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerContent');
    if(!drawer) return;
    
    drawer.classList.remove('pointer-events-none');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    
    content.classList.remove('-translate-x-full');
}

function closeDrawer() {
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerContent');
    if(!drawer) return;
    
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    
    content.classList.add('-translate-x-full');
    
    setTimeout(() => {
        if(overlay.classList.contains('opacity-0')) {
            drawer.classList.add('pointer-events-none');
        }
    }, 300);
}

function getItem(id) {
    for (let cat of menuData) {
        let found = cat.items.find(i => i.id === id);
        if (found) return found;
    }
    return null;
}

// Security: Check real Israeli time from an external API to prevent local device date spoofing
let isPromoActive = false;
let promoChecked = false;

async function verifyPromoDay() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Jerusalem', { cache: "no-store", timeout: 3000 });
        if (response.ok) {
            const data = await response.json();
            // day_of_week: 0=Sunday ... 5=Friday
            isPromoActive = (data.day_of_week === 5);
        } else {
            // Fallback to local time if API errors out
            isPromoActive = (new Date().getDay() === 5);
        }
    } catch (e) {
        isPromoActive = (new Date().getDay() === 5);
    }
    promoChecked = true;
    
    // Once checked, refresh the UI if there are items
    updateCartWidget();
    const cartModal = document.getElementById('cartModal');
    if (cartModal && !cartModal.classList.contains('opacity-0')) {
        renderCartModalItems();
    }
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal && !checkoutModal.classList.contains('opacity-0')) {
        updateCheckoutSummary();
    }
}

// Initial verification call
verifyPromoDay();

function calculateDiscount() {
    if (!promoChecked || !isPromoActive) return 0;
    
    const bakedCat = menuData.find(c => c.category === "Запеченные роллы");
    if (!bakedCat) return 0;
    
    const bakedIds = new Set(bakedCat.items.map(i => i.id));
    
    let bakedPrices = [];
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0 && bakedIds.has(id)) {
            const item = getItem(id);
            if (item) {
                for (let i = 0; i < count; i++) {
                    bakedPrices.push(item.price);
                }
            }
        }
    }
    
    const freeCount = Math.floor(bakedPrices.length / 3);
    if (freeCount === 0) return 0;
    
    bakedPrices.sort((a, b) => a - b);
    
    let discount = 0;
    for (let i = 0; i < freeCount; i++) {
        discount += bakedPrices[i];
    }
    return discount;
}

function addToCart(id) {
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    renderControls(id);
    updateCartWidget();
    
    if (navigator.vibrate) navigator.vibrate(50);
}

function removeFromCart(id) {
    if (cart[id]) {
        cart[id]--;
        if (cart[id] === 0) delete cart[id];
    }
    renderControls(id);
    updateCartWidget();
    
    if (navigator.vibrate) navigator.vibrate(50);
}

function renderControls(id) {
    const el = document.getElementById(`controls-${id}`);
    if (!el) return;
    
    const count = cart[id] || 0;
    if (count > 0) {
        el.innerHTML = `
            <div class="flex items-center bg-dark rounded-full p-0.5 border border-white/10 shadow-inner">
                <button class="w-7 h-7 flex items-center justify-center text-muted active:text-white" onclick="removeFromCart('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" /></svg>
                </button>
                <span class="w-6 text-center text-sm font-bold text-white">${count}</span>
                <button class="w-7 h-7 flex items-center justify-center text-brand active:text-white" onclick="addToCart('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
            </div>
        `;
    } else {
        el.innerHTML = `
            <button class="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition shadow-lg shadow-brand/30" onclick="addToCart('${id}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
        `;
    }
}

function updateCartWidget() {
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const headerCartCountEl = document.getElementById('headerCartCount');
    const widget = document.getElementById('cartWidget');
    
    let totalItems = 0;
    let totalPrice = 0;
    
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const item = getItem(id);
            if (item) {
                totalItems += count;
                totalPrice += (item.price * count);
            }
        }
    }
    
    totalPrice -= calculateDiscount();
    
    if (cartCountEl) cartCountEl.textContent = totalItems;
    if (cartTotalEl) cartTotalEl.textContent = `${totalPrice}₪`;
    
    if (widget) {
        if (totalItems > 0) {
            widget.classList.remove('translate-y-[150%]');
        } else {
            widget.classList.add('translate-y-[150%]');
        }
    }

    if (headerCartCountEl) {
        headerCartCountEl.textContent = totalItems;
        if (totalItems > 0) {
            headerCartCountEl.classList.remove('hidden');
        } else {
            headerCartCountEl.classList.add('hidden');
        }
    }
}

// --- Modal Logic ---
function openCartModal() {
    renderCartModalItems();
    const modal = document.getElementById('cartModal');
    const content = document.getElementById('cartModalContent');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    
    if(window.innerWidth < 640) {
        content.classList.remove('translate-y-full');
    } else {
        content.classList.remove('sm:translate-y-10');
        content.classList.add('sm:translate-y-0');
    }
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    const content = document.getElementById('cartModalContent');
    modal.classList.add('opacity-0', 'pointer-events-none');
    
    if(window.innerWidth < 640) {
        content.classList.add('translate-y-full');
    } else {
        content.classList.remove('sm:translate-y-0');
        content.classList.add('sm:translate-y-10');
    }
}

function renderCartModalItems() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartModalTotal');
    const btnCheckout = document.getElementById('btnCheckout');
    
    let totalItems = 0;
    let totalPrice = 0;
    let totalRolls = 0;
    let html = '';
    
    const rollCategories = new Set(menuData.filter(c => c.category === "Классические роллы" || c.category === "Запеченные роллы").flatMap(c => c.items.map(i => i.id)));
    
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const item = getItem(id);
            if (item) {
                totalItems += count;
                totalPrice += (item.price * count);
                if (rollCategories.has(id)) totalRolls += count;
                html += `
                    <div class="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                        <div class="flex-1 pr-3">
                            <h4 class="text-[15px] font-bold text-white/95">${item.name}</h4>
                            <span class="text-brand font-bold mt-0.5 inline-block text-[15px]">${item.price}₪</span>
                        </div>
                        <div class="flex items-center bg-dark rounded-full p-0.5 border border-white/10 shrink-0">
                            <button class="w-8 h-8 flex items-center justify-center text-muted active:text-white" onclick="removeFromCart('${id}'); renderCartModalItems()">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" /></svg>
                            </button>
                            <span class="w-6 text-center text-sm font-bold text-white">${count}</span>
                            <button class="w-8 h-8 flex items-center justify-center text-brand active:text-white" onclick="addToCart('${id}'); renderCartModalItems()">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </button>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    if (totalRolls > 0) {
        html += `
            <div class="flex justify-between items-center py-3 border-b border-white/5 last:border-0 bg-[#25D366]/5 -mx-4 px-4 border-t border-t-[#25D366]/20 mt-1">
                <div class="flex-1 pr-3 flex items-center gap-3">
                    <span class="text-xl drop-shadow-sm">🎁</span>
                    <div>
                        <h4 class="text-[13px] font-bold text-white/90 leading-tight">${i18n[currentLang].freeKitCartName}</h4>
                        <span class="text-[#25D366] font-bold mt-0.5 inline-block text-[12px] uppercase">0₪</span>
                    </div>
                </div>
                <div class="flex items-center justify-center shrink-0 min-w-8 h-8 px-2 rounded-full bg-white/5 text-white/60 text-xs font-bold ring-1 ring-white/10">
                    x${totalRolls}
                </div>
            </div>
        `;
    }

    if (totalItems === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-48 text-center pt-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14 text-muted mb-4 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                <p class="text-white/60 font-medium tracking-wide">${i18n[currentLang].cartEmpty}</p>
                <p class="text-xs text-white/30 mt-1">${i18n[currentLang].cartEmptySub}</p>
            </div>
        `;
        btnCheckout.disabled = true;
    } else {
        const discount = calculateDiscount();
        if (discount > 0) {
            html += `
                <div class="flex justify-between items-center py-2 text-brand text-sm font-bold border-t border-brand/30 mt-2">
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                        ${i18n[currentLang].promo2plus1Popup}
                    </span>
                    <span>-${discount}₪</span>
                </div>
            `;
        }
        totalPrice -= discount;
        container.innerHTML = html;
        btnCheckout.disabled = false;
    }
    
    totalEl.textContent = `${totalPrice}₪`;
}

let orderType = 'delivery'; 

function updateCheckoutSummary() {
    let subtotal = 0;
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const item = getItem(id);
            if (item) subtotal += (item.price * count);
        }
    }
    
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const discountRow = document.getElementById('checkoutDiscountRow');
    const discountValueEl = document.getElementById('checkoutDiscountValue');
    const deliveryRow = document.getElementById('checkoutDeliveryRow');
    const deliveryCostEl = document.getElementById('checkoutDeliveryCost');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (subtotalEl) subtotalEl.textContent = `${subtotal}₪`;
    
    const discount = calculateDiscount();
    const finalSubtotal = subtotal - discount;
    
    if (discountRow) {
        if (discount > 0) {
            discountRow.style.display = 'flex';
            if (discountValueEl) discountValueEl.textContent = `-${discount}₪`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    
    let deliveryCost = 0;
    if (orderType === 'delivery') {
        if (deliveryRow) deliveryRow.style.display = 'flex';
        if (finalSubtotal < 250) {
            deliveryCost = 30;
            if (deliveryCostEl) deliveryCostEl.textContent = '30₪';
        } else {
            if (deliveryCostEl) deliveryCostEl.textContent = '0₪';
        }
    } else {
        if (deliveryRow) deliveryRow.style.display = 'none';
    }
    
    if (totalEl) totalEl.textContent = `${finalSubtotal + deliveryCost}₪`;
}

function openCheckoutModal() {
    closeCartModal();
    updateCheckoutSummary();
    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutModalContent');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    
    if(window.innerWidth < 640) {
        content.classList.remove('translate-y-full');
    } else {
        content.classList.remove('sm:translate-y-10');
        content.classList.add('sm:translate-y-0');
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutModalContent');
    modal.classList.add('opacity-0', 'pointer-events-none');
    
    if(window.innerWidth < 640) {
        content.classList.add('translate-y-full');
    } else {
        content.classList.remove('sm:translate-y-0');
        content.classList.add('sm:translate-y-10');
    }
}

function backToCart() {
    closeCheckoutModal();
    setTimeout(() => {
        openCartModal();
    }, 300);
}

function setOrderType(type) {
    orderType = type;
    const selector = document.getElementById('deliverySelector');
    const btnDelivery = document.getElementById('btnTypeDelivery');
    const btnPickup = document.getElementById('btnTypePickup');
    const fields = document.getElementById('deliveryFields');
    const addressInput = document.getElementById('custAddress');
    
    if (type === 'delivery') {
        selector.style.transform = 'translateX(0)';
        btnDelivery.classList.replace('text-white/60', 'text-white');
        btnPickup.classList.replace('text-white', 'text-white/60');
        
        fields.style.display = 'block';
        setTimeout(() => fields.style.opacity = '1', 10);
        addressInput.required = true;
    } else {
        selector.style.transform = 'translateX(100%)';
        btnPickup.classList.replace('text-white/60', 'text-white');
        btnDelivery.classList.replace('text-white', 'text-white/60');
        
        fields.style.opacity = '0';
        setTimeout(() => fields.style.display = 'none', 300);
        addressInput.required = false;
    }
    updateCheckoutSummary();
}

function submitOrder() {
    const form = document.getElementById('checkoutForm');
    if(!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    
    let orderText = currentLang === 'en' ? "🍣 *New Mistorsush Order!* 🍣\n\n" : "🍣 *Новый заказ Mistorsush!* 🍣\n\n";
    orderText += `*${i18n[currentLang].nameField}:* ${name}\n`;
    orderText += `*${i18n[currentLang].phoneField}:* ${phone}\n`;
    orderText += `*${currentLang === 'en' ? 'Receiving' : 'Получение'}:* ${orderType === 'delivery' ? i18n[currentLang].delivery + ' 🚚' : i18n[currentLang].pickup + ' 🚶‍♂️'}\n\n`;
    
    if (orderType === 'delivery') {
        const address = document.getElementById('custAddress').value.trim();
        const apt = document.getElementById('custApt').value.trim();
        const floor = document.getElementById('custFloor').value.trim();
        const entrance = document.getElementById('custEntrance').value.trim();
        
        orderText += `${i18n[currentLang].whatsappAddress} ${address}`;
        if(apt) orderText += `, ${i18n[currentLang].whatsappApt} ${apt}`;
        if(floor) orderText += `, ${i18n[currentLang].whatsappFloor} ${floor}`;
        if(entrance) orderText += `, ${i18n[currentLang].whatsappEnt} ${entrance}`;
        orderText += `\n\n`;
    }
    
    let totalPrice = 0;
    let totalRolls = 0;
    const rollCategories = new Set(menuData.filter(c => c.category === "Классические роллы" || c.category === "Запеченные роллы").flatMap(c => c.items.map(i => i.id)));

    orderText += `${i18n[currentLang].whatsappOrderTitle}\n`;
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const item = getItem(id);
            if (item) {
                const itemName = currentLang === 'en' ? item.nameEn : item.name;
                orderText += `— ${itemName} x${count} (${item.price * count}₪) \n`;
                totalPrice += (item.price * count);
                if (rollCategories.has(id)) totalRolls += count;
            }
        }
    }
    
    if (totalRolls > 0) {
        orderText += `— 🎁 ${i18n[currentLang].freeKitCartName} x${totalRolls} (0₪)\n`;
    }

    const discount = calculateDiscount();
    if (discount > 0) {
        orderText += `\n${i18n[currentLang].whatsappPromo} -${discount}₪\n`;
    }
    
    const finalSubtotal = totalPrice - discount;
    
    let deliveryCost = 0;
    if (orderType === 'delivery') {
        if (finalSubtotal < 250) {
            deliveryCost = 30;
            orderText += `\n${i18n[currentLang].whatsappDelivery} 30₪\n`;
        } else {
            orderText += `\n${i18n[currentLang].whatsappDelivery} 0₪ (${i18n[currentLang].free})\n`;
        }
    }
    
    const finalPrice = finalSubtotal + deliveryCost;
    
    let comment = document.getElementById('custComment').value.trim();
    if(comment) {
        orderText += `\n${i18n[currentLang].whatsappComment} ${comment}\n`;
    }
    
    orderText += `\n${i18n[currentLang].whatsappTotal} ${finalPrice}₪`;
    
    const businessPhone = "972559284670";
    const url = `https://wa.me/${businessPhone}?text=${encodeURIComponent(orderText)}`;
    
    // Clear and close
    cart = {};
    updateCartWidget();
    closeCheckoutModal();
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTopBtn');
    if (window.scrollY > 300) {
        btn.classList.remove('opacity-0', 'translate-y-24', 'pointer-events-none');
        btn.classList.add('opacity-100', 'translate-y-0');
    } else {
        btn.classList.remove('opacity-100', 'translate-y-0');
        btn.classList.add('opacity-0', 'translate-y-24', 'pointer-events-none');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
