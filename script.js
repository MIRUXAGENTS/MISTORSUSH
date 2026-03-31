let cart = {};
let currentLang = localStorage.getItem('lang') || 'ru';
let currentCategoryView = 0;
let isSearchActive = false;
let searchQuery = '';
let currentUser = null;
let authMode = 'login'; // login or register
let orderTiming = 'asap'; // asap or scheduled

const S_URL = 'https://iaqbtwsothmkdjapstkq.supabase.co';
const S_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcWJ0d3NvdGhta2RqYXBzdGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjE0ODYsImV4cCI6MjA4OTgzNzQ4Nn0.ye0QGkypstTfxGjCkytn_x7bwsa-2tNiq3EIEulsvV0';
const sb = typeof supabase !== 'undefined' ? supabase.createClient(S_URL, S_KEY) : null;

const i18n = {
    ru: {
        subtitle: "Суши в Ашкелоне",
        workingHours: "Работаем по предварительным заказам",
        openEveryday: "Open Everyday 12:00 - 23:00",
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
        whatsappOrderTitle: "*Ваш заказ:*",
        whatsappComment: "💬 *Комментарий:*",
        whatsappDelivery: "🛵 *Доставка:*",
        whatsappPromo: "🎁 *Акция 2+1 (Пятница):*",
        whatsappTotal: "💰 *Итого к оплате:*",
        whatsappPickup: "🛒 *Самовывоз*",
        whatsappAddress: "📍 *Адрес:*",
        whatsappApt: "Кв.",
        whatsappFloor: "Этаж",
        whatsappEnt: "Подъезд",
        upsellTitle: "Не забудьте добавить",
        upsellNoThanks: "Спасибо, не в этот раз",
        upsellCheckoutBtn: "Перейти в корзину",
        searchPlaceholder: "Поиск...",
        searchResults: "Результаты поиска",
        noResults: "Ничего не найдено :(",
        outOfStock: "Нет в наличии",
        receiving: "Получение",
        freeDelivery: "БЕСПЛАТНО",
        accessibilityTitle: "Доступность",
        monochromeLabel: "Черно-белый режим",
        fontSizeLabel: "Размер шрифта",
        resetAccessibility: "Сбросить всё",
        modeStopAnimations: "Без анимаций",
        modeMonochrome: "Монохром",
        modeContrast: "Контраст",
        modeInvert: "Инверсия",
        modeReadableFont: "Шрифт Arial",
        modeHighlightLinks: "Ссылки",
        modeSepia: "Сепия",
        modeScreenReader: "Чтение вслух",
        // New keys
        authLoginTitle: "Вход в кабинет",
        authRegisterTitle: "Регистрация",
        authLoginBtn: "Войти",
        authRegisterBtn: "Создать аккаунт",
        authNoAccount: "Нет аккаунта? Зарегистрироваться",
        authHaveAccount: "Уже есть аккаунт? Войти",
        authEmailLab: "Email",
        authPassLab: "Пароль",
        profileTitle: "Мои данные",
        profileHistoryTitle: "История запеченных удовольствий",
        profileSaveBtn: "Сохранить изменения",
        profileLogoutBtn: "Выйти из аккаунта",
        profileUnnamed: "Инкогнито",
        profileOrdersEmpty: "Заказов пока нет...",
        settingsTitle: "Безопасность",
        settingsSecurity: "Безопасность",
        settingsOldPass: "Текущий пароль",
        settingsNewPass: "Новый пароль",
        settingsConfirmPass: "Подтвердите новый пароль",
        settingsUpdateBtn: "Обновить пароль",
        orderDetailsTitle: "Детали заказа",
        orderDetailsDateLab: "Дата заказа",
        orderDetailsTotalLab: "Итого",
        statusNew: "🆕 Новый",
        statusCooking: "🔥 Готовится",
        statusTransit: "🛵 В пути",
        statusCompleted: "✅ Завершен",
        timingASAP: "Как можно скорее",
        timingScheduled: "Предзаказ",
        timingDate: "Дата",
        timingTime: "Время (12:00-23:00)",
        timingLab: "Время доставки",
        validationEmpty: "Это поле обязательно",
        validationEmail: "Неверный формат Email",
        validationPhone: "Введите корректный номер (напр. 05x-xxxxxxx)",
        validationPassShort: "Пароль слишком короткий (мин. 6 симв.)",
        validationPassMatch: "Пароли не совпадают",
        alertOrderWait: "Пожалуйста, подождите несколько минут перед повторным заказом.",
        alertOrderPreorderSelect: "Пожалуйста, выберите дату и время для предзаказа",
        alertOrderTimeRange: "Заказы принимаются только с 12:00 до 23:00",
        alertOrderProcessing: "Обработка...",
        alertOrderSuccess: "Заказ успешно сохранен! Переходим в WhatsApp...",
        alertProfileUpdated: "Данные обновлены!",
        alertPassChanged: "Пароль успешно изменен!",
        alertAuthSuccessRegister: "Регистрация успешна! Теперь вы можете войти.",
        alertError: "Ошибка: ",
        confirmDelete: "Вы уверены?"
    },
    en: {
        subtitle: "Sushi in Ashkelon",
        workingHours: "Pre-orders only",
        openEveryday: "Open Everyday 12:00 - 23:00",
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
        addressPlaceholder: "Ashkelon, 12 Ben Gurion St",
        aptField: "Apartment",
        floorField: "Floor",
        entranceField: "Entrance",
        commentField: "Order Comment",
        commentPlaceholder: "E.g., no onion, call 5 min before...",
        sendWhatsapp: "Send to WhatsApp",
        subtotal: "Order subtotal:",
        discount2plus1: "Discount 2+1:",
        deliveryCostLabel: "Delivery:",
        promo2plus1Popup: "Friday Deal 2+1:",
        free: "Free!",
        whatsappOrderTitle: "*Your Order:*",
        whatsappComment: "💬 *Comment:*",
        whatsappDelivery: "🛵 *Delivery:*",
        whatsappPromo: "🎁 *Friday 2+1:*",
        whatsappTotal: "💰 *Total:*",
        whatsappPickup: "🛒 *Pickup*",
        whatsappAddress: "📍 *Address:*",
        whatsappApt: "Apt.",
        whatsappFloor: "Floor",
        whatsappEnt: "Ent.",
        upsellTitle: "Don't forget to add",
        upsellNoThanks: "No thanks",
        upsellCheckoutBtn: "Go to cart",
        searchPlaceholder: "Search...",
        searchResults: "Search results",
        noResults: "Nothing found :(",
        outOfStock: "Out of stock",
        receiving: "Receiving",
        freeDelivery: "FREE",
        accessibilityTitle: "Accessibility",
        monochromeLabel: "Monochrome Mode",
        fontSizeLabel: "Font Size",
        resetAccessibility: "Reset Settings",
        // New keys
        authLoginTitle: "Login",
        authRegisterTitle: "Registration",
        authLoginBtn: "Login",
        authRegisterBtn: "Create Account",
        authNoAccount: "Don't have an account? Register",
        authHaveAccount: "Already have an account? Login",
        authEmailLab: "Email",
        authPassLab: "Password",
        profileTitle: "My Profile",
        profileHistoryTitle: "Order History",
        profileSaveBtn: "Save Changes",
        profileLogoutBtn: "Logout",
        profileUnnamed: "Unnamed Gourmet",
        profileOrdersEmpty: "No orders yet...",
        settingsTitle: "Security",
        settingsSecurity: "Security",
        settingsOldPass: "Current Password",
        settingsNewPass: "New Password",
        settingsConfirmPass: "Confirm New Password",
        settingsUpdateBtn: "Update Password",
        orderDetailsTitle: "Order Details",
        orderDetailsDateLab: "Order Date",
        orderDetailsTotalLab: "Total",
        statusNew: "🆕 New",
        statusCooking: "🔥 Cooking",
        statusTransit: "🛵 In Transit",
        statusCompleted: "✅ Completed",
        timingASAP: "As soon as possible",
        timingScheduled: "Pre-order",
        timingDate: "Date",
        timingTime: "Time (12:00-23:00)",
        timingLab: "Delivery Time",
        validationEmpty: "This field is required",
        validationEmail: "Invalid Email format",
        validationPhone: "Enter a valid number (e.g. 05x-xxxxxxx)",
        validationPassShort: "Password too short (min. 6 chars)",
        validationPassMatch: "Passwords do not match",
        alertOrderWait: "Please wait a few minutes before placing another order.",
        alertOrderPreorderSelect: "Please select date and time for pre-order",
        alertOrderTimeRange: "Ordering is only available between 12:00 and 23:00",
        alertOrderProcessing: "Processing...",
        alertOrderSuccess: "Order successfully saved! Opening WhatsApp...",
        alertProfileUpdated: "Profile updated!",
        alertPassChanged: "Password successfully changed!",
        alertAuthSuccessRegister: "Registration successful! You can now login.",
        alertError: "Error: ",
        confirmDelete: "Are you sure?"
    }
};

/**
 * Universal translation helper
 */
function t(key) {
    if (!i18n[currentLang] || !i18n[currentLang][key]) {
        console.warn(`Translation key missing: ${key} for lang: ${currentLang}`);
        return key;
    }
    return i18n[currentLang][key];
}

/**
 * Form Validation Helpers
 */
function showError(fieldId, errorKey) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    clearError(fieldId);
    field.classList.add('is-invalid');

    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.id = `${fieldId}-error`;
    errorMsg.textContent = t(errorKey);
    field.parentNode.appendChild(errorMsg);
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('is-invalid');
    const existingError = document.getElementById(`${fieldId}-error`);
    if (existingError) existingError.remove();
}

function validateField(fieldId, rules = {}) {
    const field = document.getElementById(fieldId);
    if (!field) return true;

    const value = field.value.trim();

    if (rules.req && !value) {
        showError(fieldId, 'validationEmpty');
        return false;
    }

    if (rules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(fieldId, 'validationEmail');
            return false;
        }
    }

    if (rules.phone && value) {
        // Simple check for Israeli format: starts with 05 and has 9-10 digits, or international 972
        const phoneRegex = /^(?:05|\+9725)\d{8}$/;
        // Remove spaces and dashes for check
        const cleanPhone = value.replace(/[\s-]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showError(fieldId, 'validationPhone');
            return false;
        }
    }

    if (rules.minLen && value.length < rules.minLen) {
        showError(fieldId, 'validationPassShort'); // General key
        return false;
    }

    if (rules.match && value !== document.getElementById(rules.match).value) {
        showError(fieldId, 'validationPassMatch');
        return false;
    }

    clearError(fieldId);
    return true;
}

function clearAllErrors(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    container.querySelectorAll('.error-message').forEach(el => el.remove());
}


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

async function init() {
    applyLanguage();
    await checkSession();

    if (sb) {
        sb.auth.onAuthStateChange((event, session) => {
            checkSession();
        });

        try {
            const { data, error } = await sb.from('products').select('*').order('id');
            if (!error && data && data.length > 0) {
                const siteStatusProduct = data.find(p => p.name === 'system_site_status');
                if (siteStatusProduct && siteStatusProduct.is_available === false) {
                    showDisabledSiteModal();
                }
                transformSupabaseData(data);
            }
        } catch (e) {
            console.error("Supabase fetch error:", e);
        }
    }

    renderNav();
    renderDrawer();
    selectCategory(0);
    updateCartWidget();
    setupValidationListeners();
}

function setupValidationListeners() {
    // Checkout fields
    const checkoutFields = {
        'custName': { req: true },
        'custPhone': { req: true, phone: true },
        'custAddress': { req: true }
    };
    
    Object.keys(checkoutFields).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => validateField(id, checkoutFields[id]));
    });

    // Auth fields
    const authFields = {
        'authEmail': { req: true, email: true },
        'authPassword': { req: true, minLen: 6 }
    };
    Object.keys(authFields).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => validateField(id, authFields[id]));
    });

    // Profile fields
    const profileFields = {
        'profileName': { req: true },
        'profilePhone': { req: true, phone: true }
    };
    Object.keys(profileFields).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => validateField(id, profileFields[id]));
    });

    // Settings fields
    const settingsFields = {
        'oldPassword': { req: true },
        'newPassword': { req: true, minLen: 6 },
        'confirmNewPassword': { req: true, match: 'newPassword' }
    };
    Object.keys(settingsFields).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => validateField(id, settingsFields[id]));
    });
}

function transformSupabaseData(data) {
    // Build translation map from original menuData (from data.js) before it's cleared
    const translationMap = {};
    if (typeof menuData !== 'undefined' && Array.isArray(menuData)) {
        menuData.forEach(cat => {
            if (cat.items) {
                cat.items.forEach(item => {
                    translationMap[item.name.toLowerCase()] = {
                        nameEn: item.nameEn,
                        ingredientsEn: item.ingredientsEn,
                        image: item.image
                    };
                });
            }
        });
    }

    const categoryOrder = [
        'classic_rolls',
        'baked_rolls',
        'unusual_rolls',
        'burgers',
        'gunkan',
        'drinks'
    ];

    const categoryNamesRu = {
        'classic_rolls': 'Классические роллы',
        'baked_rolls': 'Запеченные роллы',
        'unusual_rolls': 'Необычные роллы',
        'burgers': 'Рисовые гамбургеры',
        'gunkan': 'Гункан и суши',
        'drinks': 'Напитки'
    };

    const categoryNamesEn = {
        'classic_rolls': 'Classic Rolls',
        'baked_rolls': 'Baked Rolls',
        'unusual_rolls': 'Unusual Rolls',
        'burgers': 'Rice Burgers',
        'gunkan': 'Gunkan and Sushi',
        'drinks': 'Drinks'
    };

    const newMenuData = categoryOrder.map(catSlug => {
        return {
            category: categoryNamesRu[catSlug] || catSlug,
            categoryEn: categoryNamesEn[catSlug] || catSlug,
            items: data.filter(p => p.category === catSlug).map(p => {
                const trans = translationMap[p.name.toLowerCase()] || {};
                return {
                    id: p.id.toString(),
                    name: p.name,
                    nameEn: trans.nameEn || p.name,
                    price: p.price,
                    ingredients: p.description || "",
                    ingredientsEn: trans.ingredientsEn || p.description || "",
                    image: trans.image || p.image_url,
                    is_available: p.is_available
                };
            })
        };
    }).filter(cat => cat.items.length > 0);

    // Update global menuData
    if (newMenuData.length > 0) {
        menuData.splice(0, menuData.length, ...newMenuData);
    }
}

function getCategoryOfItem(id) {
    const cat = menuData.find(c => c.items.some(i => i.id === id));
    return cat ? cat.category : "";
}

function renderNav() {
    const nav = document.getElementById('categoryNav');
    nav.innerHTML = menuData.map((cat, index) => {
        const isActive = !isSearchActive && index === currentCategoryView;
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

    let itemsToRender = [];
    let sectionTitle = '';
    let bgColor = 'bg-card';
    let borderColor = 'border-white/5';

    if (isSearchActive) {
        sectionTitle = i18n[currentLang].searchResults;
        menuData.forEach(cat => {
            cat.items.forEach(item => {
                const nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
                const enMatch = (item.nameEn || '').toLowerCase().includes(searchQuery.toLowerCase());
                if (nameMatch || enMatch) {
                    itemsToRender.push(item);
                }
            });
        });
    } else {
        const cat = menuData[currentCategoryView];
        if (!cat) return;
        sectionTitle = currentLang === 'en' ? cat.categoryEn : cat.category;
        itemsToRender = cat.items;

        const isClassic = currentCategoryView === 0;
        const isBaked = currentCategoryView === 1;
        const isUnusual = currentCategoryView === 2;
        const isBurgers = currentCategoryView === 3;
        const isGunkan = currentCategoryView === 4;
        const isDrinks = currentCategoryView === 5;

        if (isClassic) {
            bgColor = 'bg-[#12141a]';
            borderColor = 'border-[#1e2330]';
        } else if (isBaked) {
            bgColor = 'bg-[#1c1814]';
            borderColor = 'border-[#2e2620]';
        } else if (isUnusual) {
            bgColor = 'bg-[#1c1a14]';
            borderColor = 'border-[#423821]';
        } else if (isBurgers) {
            bgColor = 'bg-[#1e1c16]';
            borderColor = 'border-[#332b21]';
        } else if (isGunkan) {
            bgColor = 'bg-[#181a1d]';
            borderColor = 'border-[#252a33]';
        } else if (isDrinks) {
            bgColor = 'bg-[#2a2d39]';
            borderColor = 'border-[#3a3e4c]';
        }
    }

    if (itemsToRender.length === 0) {
        container.innerHTML = `
        <section class="menu-section animate-fade-in">
            <h2 class="text-2xl font-bold mb-6 tracking-tight text-white/95 flex items-center justify-center gap-4 text-center uppercase text-[22px]">
                <div class="h-px bg-white/10 flex-grow"></div>
                ${sectionTitle}
                <div class="h-px bg-white/10 flex-grow"></div>
            </h2>
            <div class="text-center py-16 text-muted bg-card/50 rounded-2xl border border-white/5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 opacity-20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p class="font-medium tracking-wider text-sm uppercase">${isSearchActive ? i18n[currentLang].noResults : 'Пока пусто'}</p>
                ${!isSearchActive ? '<p class="text-xs opacity-50 mt-1">Скоро мы добавим сюда товары</p>' : ''}
            </div>
        </section>
        `;
        return;
    }

    container.innerHTML = `
    <section class="menu-section animate-fade-in">
        <h2 class="text-2xl font-bold mb-6 tracking-tight text-white/95 flex items-center justify-center gap-4 text-center uppercase text-[22px]">
            <div class="h-px bg-white/10 flex-grow"></div>
            ${sectionTitle}
            <div class="h-px bg-white/10 flex-grow"></div>
        </h2>
        
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            ${itemsToRender.map(item => {
        const isUnusualItem = getCategoryOfItem(item.id) === "Необычные роллы";
        const shadowClass = isUnusualItem ? 'shadow-[0_0_20px_rgba(218,165,32,0.15)] shadow-black/40' : 'shadow-lg shadow-black/30';

        // If searching, we may have mixed categories, so we dynamically pick background
        let itemBg = bgColor;
        let itemBorder = borderColor;

        if (isSearchActive) {
            const catName = getCategoryOfItem(item.id);
            if (catName === "Классические роллы") { itemBg = 'bg-[#12141a]'; itemBorder = 'border-[#1e2330]'; }
            else if (catName === "Запеченные роллы") { itemBg = 'bg-[#1c1814]'; itemBorder = 'border-[#2e2620]'; }
            else if (catName === "Необычные роллы") { itemBg = 'bg-[#1c1a14]'; itemBorder = 'border-[#423821]'; }
            else if (catName === "Рисовые гамбургеры") { itemBg = 'bg-[#1e1c16]'; itemBorder = 'border-[#332b21]'; }
            else if (catName === "Гункан и суши") { itemBg = 'bg-[#181a1d]'; itemBorder = 'border-[#252a33]'; }
            else if (catName === "Напитки") { itemBg = 'bg-[#2a2d39]'; itemBorder = 'border-[#3a3e4c]'; }
        }

        const isAvailable = item.is_available !== false;
        const opacityClass = isAvailable ? '' : 'opacity-60 grayscale-[0.7] contrast-[0.8]';

        return `
                <div class="product-card flex gap-4 ${itemBg} p-4 rounded-[1.5rem] border ${itemBorder} ${shadowClass} transition-all duration-300 ${opacityClass} relative group hover:border-brand/40">
                    ${!isAvailable ? `<div class="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center">
                        <span class="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
                            ${i18n[currentLang].outOfStock}
                        </span>
                    </div>` : ''}
                    
                    ${item.image ? `
                    <div class="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden shadow-lg relative transition-all group-hover:scale-105 duration-300 cursor-zoom-in" onclick="openImageModal('${item.image}')">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                            </svg>
                        </div>
                    </div>
                    ` : ''}

                    <div class="flex-grow flex flex-col justify-between py-0.5">
                        <div class="mb-2">
                            <h3 class="font-bold text-[14px] sm:text-[16px] leading-snug text-white/95 mb-1 line-clamp-2">${currentLang === 'en' ? item.nameEn : item.name}</h3>
                            <p class="text-[10px] sm:text-[11px] text-muted leading-relaxed line-clamp-2 opacity-70">${currentLang === 'en' ? item.ingredientsEn : item.ingredients}</p>
                        </div>
                        <div class="flex justify-between items-center transition-all">
                            <span class="font-black text-sm sm:text-lg text-brand ${!isAvailable ? 'opacity-50' : ''}">${item.price}₪</span>
                            <div class="cart-controls" id="controls-${item.id}">
                                ${isAvailable ? renderControlsHTML(item.id) : ''}
                            </div>
                        </div>
                    </div>
                </div>
                `;
    }).join('')}
        </div>
    </section>
    `;
}

function renderDrawer() {
    const container = document.getElementById('drawerLinks');
    if (!container) return;

    const icons = {
        "Классические роллы": "🍣",
        "Запеченные роллы": "🔥",
        "Необычные роллы": "✨",
        "Рисовые гамбургеры": "🍔",
        "Гункан и суши": "🥢",
        "Напитки": "🥤"
    };

    container.innerHTML = menuData.map((cat, index) => {
        const isActive = !isSearchActive && index === currentCategoryView;
        const icon = icons[cat.category] || "🍱";
        const activeClass = isActive
            ? 'bg-brand/10 text-brand border-brand/30 shadow-[inset_0_0_20px_rgba(230,57,70,0.05)]'
            : 'bg-transparent text-white/80 border-transparent hover:bg-white/5 hover:translate-x-1';

        return `
        <button onclick="selectCategory(${index})" class="w-full text-left px-4 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${activeClass}">
            <span class="text-2xl group-hover:scale-110 transition-transform duration-300">${icon}</span>
            <div class="flex flex-col">
                <span class="font-bold text-[13px] tracking-wider uppercase">${currentLang === 'en' ? cat.categoryEn : cat.category}</span>
                <span class="text-[10px] text-muted font-medium uppercase tracking-widest mt-0.5 opacity-60">${cat.items.filter(i => i.is_available !== false).length} ${currentLang === 'en' ? 'items' : 'позиций'}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4 ml-auto ${isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 group-hover:translate-x-1 transition-all"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        </button>
        `;
    }).join('');
}

function selectCategory(index) {
    currentCategoryView = index;
    isSearchActive = false;
    searchQuery = '';
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) searchInput.value = '';
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
    if (!drawer) return;

    drawer.classList.remove('pointer-events-none');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');

    content.classList.remove('-translate-x-full');
}

function closeDrawer() {
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerContent');
    if (!drawer) return;

    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');

    content.classList.add('-translate-x-full');

    setTimeout(() => {
        if (overlay.classList.contains('opacity-0')) {
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        // Primary: timeapi.io
        const response = await fetch('https://www.timeapi.io/api/Time/current/zone?timeZone=Asia/Jerusalem', {
            cache: "no-store",
            signal: controller.signal
        });

        if (response.ok) {
            const data = await response.json();
            // timeapi.io returns dayOfWeek as a string (e.g., "Friday")
            isPromoActive = (data.dayOfWeek === 'Friday');
        } else {
            throw new Error("timeapi.io failed");
        }
    } catch (e) {
        // Fallback: Try worldtimeapi.org or local time
        try {
            const backupController = new AbortController();
            const backupTimeout = setTimeout(() => backupController.abort(), 3000);
            const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Jerusalem', {
                cache: "no-store",
                signal: backupController.signal
            });
            clearTimeout(backupTimeout);
            if (response.ok) {
                const data = await response.json();
                isPromoActive = (data.day_of_week === 5);
            } else {
                isPromoActive = (new Date().getDay() === 5);
            }
        } catch (err) {
            isPromoActive = (new Date().getDay() === 5);
        }
    } finally {
        clearTimeout(timeoutId);
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

function calculateSubtotal() {
    let subtotal = 0;
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const item = getItem(id);
            if (item) subtotal += (item.price * count);
        }
    }
    return subtotal;
}

function calculateDiscount() {
    if (!promoChecked || !isPromoActive) return 0;

    const bakedCat = menuData.find(c => c.category === "Запеченные роллы");
    if (!bakedCat) return 0;

    const bakedIds = new Set(bakedCat.items.filter(i => i.is_available !== false).map(i => i.id));

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
    const item = getItem(id);
    if (item && item.is_available === false) return; // Prevent adding if unavailable

    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    updateCartWidget();
    renderControls(id);
    if (!document.getElementById('cartModal').classList.contains('opacity-0')) renderCartModalItems();
}

function removeFromCart(id) {
    if (cart[id] && cart[id] > 0) {
        cart[id]--;
        if (cart[id] === 0) delete cart[id];
        updateCartWidget();
        renderControls(id);
        if (!document.getElementById('cartModal').classList.contains('opacity-0')) renderCartModalItems();
    }
}

function renderControlsHTML(id) {
    const count = cart[id] || 0;
    if (count > 0) {
        return `
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
        return `
            <button class="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition shadow-lg shadow-brand/30" onclick="addToCart('${id}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
        `;
    }
}

function renderControls(id) {
    const el = document.getElementById(`controls-${id}`);
    if (!el) return;
    el.innerHTML = renderControlsHTML(id);
}

function handleSearch(query) {
    searchQuery = query.trim();
    isSearchActive = searchQuery.length > 0;
    renderMenu();
    renderNav();
    if (isSearchActive) {
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }
}

function clearSearch() {
    const input = document.getElementById('menuSearch');
    if (input) input.value = '';
    handleSearch('');
    closeDrawer();
}

function updateCartWidget() {
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const headerCartCountEl = document.getElementById('headerCartCount');
    const widget = document.getElementById('cartWidget');

    const subtotal = calculateSubtotal();
    let totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    let totalPrice = subtotal - calculateDiscount();

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

    if (window.innerWidth < 640) {
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

    if (window.innerWidth < 640) {
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
    let html = '';

    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const item = getItem(id);
            if (item) {
                totalItems += count;
                totalPrice += (item.price * count);
                html += `
                    <div class="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                        <div class="flex-1 pr-3">
                            <h4 class="text-[15px] font-bold text-white/95">${currentLang === 'en' ? (item.nameEn || item.name) : item.name}</h4>
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
    let subtotal = calculateSubtotal();

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
    
    // Show/Hide Order Timing section for registered users
    const timingSection = document.getElementById('orderTimingSection');
    if (timingSection) {
        if (currentUser) {
            timingSection.classList.remove('hidden');
            setOrderTiming('asap'); // Reset to ASAP
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('orderDate');
            if (dateInput) {
                dateInput.value = today;
                dateInput.setAttribute('min', today);
            }
        } else {
            timingSection.classList.add('hidden');
            orderTiming = 'asap';
        }
    }

    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutModalContent');
    modal.classList.remove('opacity-0', 'pointer-events-none');

    if (window.innerWidth < 640) {
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

    if (window.innerWidth < 640) {
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

function backToCartFromUpsell() {
    closeUpsellModal();
    setTimeout(() => {
        openCartModal();
    }, 300);
}

// --- Upsell Logic ---
let hasShownUpsell = false;
let isItemsAddedFromUpsell = false;
let currentUpsellSuggestionIds = [];

function handleCheckoutClick() {
    if (hasShownUpsell) {
        openCheckoutModal();
        return;
    }

    const suggestions = getUpsellSuggestions();
    if (suggestions.length === 0) {
        hasShownUpsell = true;
        openCheckoutModal();
        return;
    }

    currentUpsellSuggestionIds = suggestions.map(i => i.id);
    renderUpsellCarousel(suggestions);

    // Reset state for this modal viewing
    isItemsAddedFromUpsell = false;
    hasShownUpsell = true; // Mark as shown so returning to cart allows checking out later
    updateUpsellCheckoutButton();

    closeCartModal();
    setTimeout(() => {
        openUpsellModal();
    }, 300);
}

function skipUpsellAndCheckout() {
    hasShownUpsell = true;
    closeUpsellModal();
    setTimeout(() => {
        openCheckoutModal();
    }, 300);
}

function openUpsellModal() {
    const modal = document.getElementById('upsellModal');
    const content = document.getElementById('upsellModalContent');
    modal.classList.remove('opacity-0', 'pointer-events-none');

    if (window.innerWidth < 640) {
        content.classList.remove('translate-y-full');
    } else {
        content.classList.remove('sm:translate-y-10');
        content.classList.add('sm:translate-y-0');
    }
}

function closeUpsellModal() {
    const modal = document.getElementById('upsellModal');
    const content = document.getElementById('upsellModalContent');
    modal.classList.add('opacity-0', 'pointer-events-none');

    if (window.innerWidth < 640) {
        content.classList.add('translate-y-full');
    } else {
        content.classList.remove('sm:translate-y-0');
        content.classList.add('sm:translate-y-10');
    }
}

function getUpsellSuggestions() {
    let hasSushi = false;
    let hasDrinks = false;
    let hasSauces = false;

    const sushiCategories = ["Классические роллы", "Запеченные роллы"];
    const drinksCategory = "Напитки";
    const saucesCategory = "Соусы";

    // Check what's in the cart
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const itemCategory = getCategoryOfItem(id);
            if (sushiCategories.includes(itemCategory)) hasSushi = true;
            if (itemCategory === drinksCategory) hasDrinks = true;
            if (itemCategory === saucesCategory) hasSauces = true;
        }
    }

    // If cart is empty, return none
    if (Object.keys(cart).length === 0) return [];

    // Gather available items by category
    const availableDrinks = menuData.find(c => c.category === drinksCategory)?.items || [];
    const availableSauces = menuData.find(c => c.category === saucesCategory)?.items || [];

    let cheapRolls = [];
    menuData.filter(c => sushiCategories.includes(c.category)).forEach(cat => {
        cat.items.forEach(i => {
            if (i.price < 30) {
                cheapRolls.push(i);
            }
        });
    });

    let allOtherItems = [];
    menuData.forEach(cat => {
        cat.items.forEach(i => {
            allOtherItems.push(i);
        });
    });

    let suggestions = [];

    // Logical schema
    if (hasSushi && !hasDrinks && !hasSauces) {
        suggestions = [
            ...getRandomItems(availableDrinks, 3),
            ...getRandomItems(availableSauces, 3)
        ];
    } else if (hasSushi && hasDrinks && !hasSauces) {
        suggestions = [
            ...getRandomItems(availableSauces, 3),
            ...getRandomItems(cheapRolls, 3)
        ];
    } else if (hasSushi && hasSauces && !hasDrinks) {
        suggestions = [
            ...getRandomItems(availableDrinks, 3),
            ...getRandomItems(cheapRolls, 3)
        ];
    }

    // If somehow we don't have exactly 6 unique items, pad with any items (excluding ones already in the list)
    if (suggestions.length < 6) {
        const needed = 6 - suggestions.length;
        const currentIds = new Set(suggestions.map(i => i.id));
        const paddingPool = allOtherItems.filter(i => !currentIds.has(i.id));
        suggestions = [...suggestions, ...getRandomItems(paddingPool, needed)];
    }

    return suggestions.slice(0, 6);
}

function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getCategoryOfItem(id) {
    for (const cat of menuData) {
        if (cat.items.find(i => i.id === id)) {
            return cat.category;
        }
    }
    return null;
}

function renderUpsellControlsHTML(id) {
    const count = cart[id] || 0;
    if (count > 0) {
        return `
            <div class="flex items-center bg-dark rounded-full p-0.5 border border-white/10 shadow-inner">
                <button type="button" class="w-7 h-7 flex items-center justify-center text-muted hover:text-white active:scale-95 transition" onclick="removeUpsellItem('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" /></svg>
                </button>
                <span class="w-6 text-center text-sm font-bold text-white">${count}</span>
                <button type="button" class="w-7 h-7 flex items-center justify-center text-brand hover:text-white active:scale-95 transition" onclick="addUpsellItemToCart('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
            </div>
        `;
    } else {
        return `
            <button type="button" onclick="addUpsellItemToCart('${id}')" class="w-8 h-8 rounded-full bg-white/5 text-white flex items-center justify-center active:scale-90 transition-all border border-white/10 hover:bg-white/10 shadow-sm relative overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
        `;
    }
}

function renderUpsellCarousel(items) {
    const container = document.getElementById('upsellCarouselContainer');

    container.innerHTML = items.map(item => `
        <div class="upsell-card shrink-0 w-[140px] lg:w-full lg:max-w-[140px] bg-card p-3 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center relative overflow-hidden group snap-center min-h-[160px]">
            ${item.image ? `
            <div class="w-[90px] h-[90px] mb-2 flex items-center justify-center relative bg-white/5 rounded-xl">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300">
            </div>
            ` : ''}
            <h3 class="font-bold text-[13px] leading-tight text-center text-white/95 line-clamp-2 min-h-[30px] w-full mb-1 ${item.image ? '' : 'mt-4'}">
                ${currentLang === 'en' ? (item.nameEn || item.name) : item.name}
            </h3>
            <div class="flex items-center justify-between w-full mt-auto pt-2 border-t border-white/5 h-[40px]">
                <span class="font-bold text-sm text-brand">${item.price}₪</span>
                <div id="upsell-controls-${item.id}">
                    ${renderUpsellControlsHTML(item.id)}
                </div>
            </div>
        </div>
    `).join('');
}

function addUpsellItemToCart(id) {
    addToCart(id);

    isItemsAddedFromUpsell = true;
    updateUpsellCheckoutButton();

    const container = document.getElementById('upsell-controls-' + id);
    if (container) {
        container.innerHTML = renderUpsellControlsHTML(id);
    }
}

function removeUpsellItem(id) {
    removeFromCart(id);

    const container = document.getElementById('upsell-controls-' + id);
    if (container) {
        container.innerHTML = renderUpsellControlsHTML(id);
    }

    // Check if there are any upsell items left in the cart
    let stillHasItems = false;
    for (const sid of currentUpsellSuggestionIds) {
        if (cart[sid] > 0) {
            stillHasItems = true;
            break;
        }
    }
    isItemsAddedFromUpsell = stillHasItems;
    updateUpsellCheckoutButton();
}

function updateUpsellCheckoutButton() {
    const btn = document.getElementById('btnUpsellCheckout');
    const textSpan = document.getElementById('upsellBtnText');

    if (isItemsAddedFromUpsell) {
        btn.classList.remove('bg-white/5', 'text-white/90', 'border-white/10');
        btn.classList.add('bg-[#25D366]', 'text-white', 'border-transparent', 'shadow-lg', 'shadow-[#25D366]/20');
        textSpan.textContent = i18n[currentLang].upsellCheckoutBtn;
        btn.setAttribute('onclick', 'backToCartFromUpsell()');
    } else {
        btn.classList.add('bg-white/5', 'text-white/90', 'border-white/10');
        btn.classList.remove('bg-[#25D366]', 'text-white', 'border-transparent', 'shadow-lg', 'shadow-[#25D366]/20');
        textSpan.textContent = i18n[currentLang].upsellNoThanks;
        btn.setAttribute('onclick', 'skipUpsellAndCheckout()');
    }
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

function sanitizeString(str) {
    if (!str) return '';
    return str.replace(/[<>\/\\]/g, '').trim();
}

async function submitOrder() {
    // 0. Anti-Spam Check
    const honeypot = document.getElementById('custWebsite').value;
    if (honeypot) {
        console.warn("Spam detected via honeypot");
        return;
    }

    if (typeof isSiteDisabled !== 'undefined' && isSiteDisabled) {
        alert("Заказы временно не принимаются. Попробуйте позже.");
        return;
    }

    const lastOrderTime = localStorage.getItem('lastOrderTime');
    if (lastOrderTime) {
        const diff = Date.now() - parseInt(lastOrderTime);
        if (diff < 3 * 60 * 1000) { // 3 minutes
            alert(t('alertOrderWait'));
            return;
        }
    }

    clearAllErrors('checkoutModal');
    
    const nameValid = validateField('custName', { req: true });
    const phoneValid = validateField('custPhone', { req: true, phone: true });
    let addressValid = true;
    if (orderType === 'delivery') {
        addressValid = validateField('custAddress', { req: true });
    }
    
    if (!nameValid || !phoneValid || !addressValid) {
        // Find first invalid and scroll to it if needed
        const firstInvalid = document.querySelector('#checkoutModal .is-invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const name = sanitizeString(document.getElementById('custName').value);
    const phone = sanitizeString(document.getElementById('custPhone').value);
    const address = sanitizeString(document.getElementById('custAddress').value);
    const apt = sanitizeString(document.getElementById('custApt').value);
    const floor = sanitizeString(document.getElementById('custFloor').value);
    const entrance = sanitizeString(document.getElementById('custEntrance').value);
    const comment = sanitizeString(document.getElementById('custComment').value);

    // Timing Validation
    let deliveryTimeText = t('timingASAP');
    if (orderTiming === 'scheduled') {
        const date = sanitizeString(document.getElementById('orderDate').value);
        const time = sanitizeString(document.getElementById('orderTime').value);
        
        if (!date || !time) {
            alert(t('alertOrderPreorderSelect'));
            return;
        }
        
        const hour = parseInt(time.split(':')[0]);
        if (hour < 12 || hour >= 23) {
            alert(t('alertOrderTimeRange'));
            return;
        }
        
        deliveryTimeText = `${date} ${time}`;
    }

    const btn = document.querySelector('button[onclick="submitOrder()"]');
    const originalBtnContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2">⏳</span> ${t('alertOrderProcessing')}`;

    const subtotal = calculateSubtotal();
    const deliveryCost = orderType === 'delivery' ? (subtotal >= 250 ? 0 : 30) : 0;
    const discount = calculateDiscount();
    const finalPrice = subtotal - discount + deliveryCost;

    const fullAddress = `${address}${apt ? ', кв.' + apt : ''}${floor ? ', эт.' + floor : ''}${entrance ? ', под.' + entrance : ''}`;

    let orderItemsText = Object.entries(cart)
        .filter(([id, count]) => count > 0)
        .map(([id, count]) => {
            const item = getItem(id);
            const displayName = item ? (currentLang === 'en' ? (item.nameEn || item.name) : item.name) : '';
            return item ? `${displayName} x${count} (${item.price * count}₪)` : '';
        })
        .filter(text => text !== '')
        .join('\n');
    let orderDetailsForDb = orderItemsText.trim();
    if (discount > 0) {
        orderDetailsForDb += `\nСкидка: -${discount}₪`;
    }
    if (deliveryCost > 0) {
        orderDetailsForDb += `\nДоставка: +${deliveryCost}₪`;
    }

    try {
        if (sb) {
            const orderData = {
                customer_name: name,
                customer_phone: phone,
                delivery_address: orderType === 'delivery' ? fullAddress : 'Самовывоз',
                order_type: orderType === 'delivery' ? 'Доставка' : 'Самовывоз',
                comment: comment,
                total_sum: finalPrice,
                status: 'new',
                delivery_time: deliveryTimeText,
                items_json: {
                    cart: cart,
                    order_items: orderDetailsForDb
                }
            };
            
            if (currentUser) {
                orderData.customer_email = currentUser.email;
            }

            const { error } = await sb.from('orders').insert([orderData]);

            if (error) {
                alert(t('alertError') + error.message);
                btn.disabled = false;
                btn.innerHTML = originalBtnContent;
                return;
            }
        }

        localStorage.setItem('lastOrderTime', Date.now().toString());
        alert(t('alertOrderSuccess'));

        // 2. Prepare WhatsApp message
        let whatsappText = currentLang === 'en' ? "🍣 *New Mistorsush Order!* 🍣\n\n" : "🍣 *Новый заказ Mistorsush!* 🍣\n\n";
        whatsappText += `*${t('nameField')}:* ${name}\n`;
        whatsappText += `*${t('phoneField')}:* ${phone}\n`;
        whatsappText += `*${t('receiving')}:* ${orderType === 'delivery' ? t('delivery') + ' 🚚' : t('pickup') + ' 🚶‍♂️'}\n`;
        whatsappText += `*${t('timingLab')}:* ${deliveryTimeText}\n\n`;

        if (orderType === 'delivery') {
            whatsappText += `${t('whatsappAddress')} ${fullAddress}\n\n`;
        }

        whatsappText += `${t('whatsappOrderTitle')}\n${orderItemsText}`;

        if (discount > 0) {
            whatsappText += `\n\n*${t('discount2plus1')}:* -${discount}₪`;
        }

        if (deliveryCost > 0) {
            whatsappText += `\n*${t('deliveryCostLabel')}:* ${deliveryCost}₪`;
        } else if (orderType === 'delivery') {
            whatsappText += `\n*${t('deliveryCostLabel')}:* ${t('freeDelivery')}`;
        }

        whatsappText += `\n\n*${t('totalToPay')} ${finalPrice}₪*`;

        if (comment) {
            whatsappText += `\n\n*${t('commentField')}:* ${comment}`;
        }

        const whatsappUrl = `https://wa.me/972559284670?text=${encodeURIComponent(whatsappText)}`;

        // Finalize UI and Redirect
        window.location.href = whatsappUrl;

        // Final cleanup
        cart = {};
        updateCartWidget();
        closeCheckoutModal();
        closeCartModal();

        btn.disabled = false;
        btn.innerHTML = originalBtnContent;

    } catch (err) {
        alert(t('alertError') + err.message);
        btn.disabled = false;
        btn.innerHTML = originalBtnContent;
    }
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

// User Account & Auth
async function checkSession() {
    if (!sb) return;
    const { data: { session } } = await sb.auth.getSession();
    currentUser = session?.user || null;
    
    const indicator = document.getElementById('accountActiveIndicator');
    if (currentUser) {
        indicator?.classList.remove('hidden');
        loadProfileData();
    } else {
        indicator?.classList.add('hidden');
    }
}

function toggleAuthOrProfile() {
    if (currentUser) {
        openProfileModal();
    } else {
        openAuthModal();
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    const content = document.getElementById('authModalContent');
    modal.classList.remove('pointer-events-none', 'opacity-0');
    content.classList.remove('translate-y-full', 'sm:translate-y-10');
    content.classList.add('translate-y-0');
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    const content = document.getElementById('authModalContent');
    modal.classList.add('pointer-events-none', 'opacity-0');
    content.classList.add('translate-y-full', 'sm:translate-y-10');
    content.classList.remove('translate-y-0');
}

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'register' : 'login';
    const title = document.getElementById('authModalTitle');
    const btnText = document.getElementById('authSubmitBtn');
    const toggleBtn = document.getElementById('authToggleBtn');
    
    if (authMode === 'login') {
        title.textContent = t('authLoginTitle');
        btnText.textContent = t('authLoginBtn');
        toggleBtn.textContent = t('authNoAccount');
    } else {
        title.textContent = t('authRegisterTitle');
        btnText.textContent = t('authRegisterBtn');
        toggleBtn.textContent = t('authHaveAccount');
    }
}

async function handleAuth(event) {
    event.preventDefault();
    if (!sb) return;
    
    clearAllErrors('authModal');
    
    const emailValid = validateField('authEmail', { req: true, email: true });
    const passValid = validateField('authPassword', { req: true, minLen: 6 });
    
    if (!emailValid || !passValid) return;
    
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const btn = document.getElementById('authSubmitBtn');
    
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = '...';
    
    try {
        if (authMode === 'login') {
            const { error } = await sb.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } else {
            const { data, error } = await sb.auth.signUp({ email, password });
            if (error) throw error;
            
            if (data.user) {
                const { error: profileError } = await sb.from('profiles').insert([{
                    id: data.user.id,
                    email: email,
                    full_name: '',
                    phone: '',
                    address: '',
                    role: 'user'
                }]);
                if (profileError) console.error("Error creating profile:", profileError);
            }

            alert(t('alertAuthSuccessRegister'));
            toggleAuthMode();
            btn.disabled = false;
            btn.textContent = originalText;
            return;
        }
        closeAuthModal();
    } catch (err) {
        alert(t('alertError') + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

async function handleLogout() {
    if (!sb) return;
    await sb.auth.signOut();
    currentUser = null;
    closeProfileModal();
    window.location.reload();
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');
    modal.classList.remove('pointer-events-none', 'opacity-0');
    content.classList.remove('translate-y-full', 'sm:translate-y-10');
    content.classList.add('translate-y-0');
    
    if (currentUser) {
        document.getElementById('profileUserEmail').textContent = currentUser.email;
        loadProfileData();
        loadUserOrders();
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');
    modal.classList.add('pointer-events-none', 'opacity-0');
    content.classList.add('translate-y-full', 'sm:translate-y-10');
    content.classList.remove('translate-y-0');
}

async function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const content = document.getElementById('settingsModalContent');
    modal.classList.remove('pointer-events-none', 'opacity-0');
    content.classList.remove('translate-y-full', 'sm:translate-y-10');
    content.classList.add('translate-y-0');
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const content = document.getElementById('settingsModalContent');
    modal.classList.add('pointer-events-none', 'opacity-0');
    content.classList.add('translate-y-full', 'sm:translate-y-10');
    content.classList.remove('translate-y-0');
    
    // Clear fields
    if (document.getElementById('oldPassword')) document.getElementById('oldPassword').value = '';
    if (document.getElementById('newPassword')) document.getElementById('newPassword').value = '';
    if (document.getElementById('confirmNewPassword')) document.getElementById('confirmNewPassword').value = '';
}

function setOrderTiming(timing) {
    orderTiming = timing;
    const indicator = document.getElementById('timingIndicator');
    const btnASAP = document.getElementById('btnASAP');
    const btnScheduled = document.getElementById('btnScheduled');
    const fields = document.getElementById('scheduledFields');
    
    if (timing === 'asap') {
        indicator.style.transform = 'translateX(0)';
        btnASAP.classList.replace('text-white/40', 'text-white');
        btnScheduled.classList.replace('text-white', 'text-white/40');
        fields.classList.add('hidden');
    } else {
        indicator.style.transform = 'translateX(100%)';
        btnScheduled.classList.replace('text-white/40', 'text-white');
        btnASAP.classList.replace('text-white', 'text-white/40');
        fields.classList.remove('hidden');
    }
}

function openOrderDetailsModal(order) {
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsModalContent');
    modal.classList.remove('pointer-events-none', 'opacity-0');
    content.classList.remove('translate-y-full', 'sm:translate-y-10');
    content.classList.add('translate-y-0');
    
    const date = new Date(order.created_at).toLocaleString(currentLang === 'en' ? 'en-US' : 'ru-RU');
    document.getElementById('orderDetailsDate').textContent = date;
    document.getElementById('orderDetailsTitle').textContent = (currentLang === 'en' ? 'Order #' : 'Заказ №') + order.id;
    
    let contentHtml = `<div class="bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
        <span class="text-[9px] uppercase font-black text-brand tracking-widest block mb-1">Время доставки</span>
        <span class="text-xs font-bold text-white">${order.delivery_time || 'Как можно скорее'}</span>
    </div>`;
    contentHtml += order.items_json.order_items || "";
    
    document.getElementById('orderDetailsContent').innerText = ""; 
    document.getElementById('orderDetailsContent').innerHTML = contentHtml;
    
    document.getElementById('orderDetailsTotal').textContent = order.total_sum + '₪';
}

function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsModalContent');
    modal.classList.add('pointer-events-none', 'opacity-0');
    content.classList.add('translate-y-full', 'sm:translate-y-10');
    content.classList.remove('translate-y-0');
}

async function loadProfileData() {
    if (!currentUser || !sb) return;
    
    try {
        const { data: profile, error } = await sb.from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
        if (error) throw error;
        if (!profile) return;
        
        const name = profile.full_name || "";
        const phone = profile.phone || "";
        const address = profile.address || "";
        const apt = profile.apt || "";
        const floor = profile.floor || "";
        const entrance = profile.entrance || "";
        
        if (document.getElementById('profileName')) document.getElementById('profileName').value = name;
        if (document.getElementById('profilePhone')) document.getElementById('profilePhone').value = phone;
        if (document.getElementById('profileAddress')) document.getElementById('profileAddress').value = address;
        if (document.getElementById('profileApt')) document.getElementById('profileApt').value = apt;
        if (document.getElementById('profileFloor')) document.getElementById('profileFloor').value = floor;
        if (document.getElementById('profileEntrance')) document.getElementById('profileEntrance').value = entrance;
        
        document.getElementById('profileUserName').textContent = name || t('profileUnnamed');
        
        // Also auto-fill checkout if empty
        if (name && document.getElementById('custName') && !document.getElementById('custName').value) {
            document.getElementById('custName').value = name;
        }
        if (phone && document.getElementById('custPhone') && !document.getElementById('custPhone').value) {
            document.getElementById('custPhone').value = phone;
        }
        if (address && document.getElementById('custAddress') && !document.getElementById('custAddress').value) {
            document.getElementById('custAddress').value = address;
        }
        if (apt && document.getElementById('custApt') && !document.getElementById('custApt').value) {
            document.getElementById('custApt').value = apt;
        }
        if (floor && document.getElementById('custFloor') && !document.getElementById('custFloor').value) {
            document.getElementById('custFloor').value = floor;
        }
        if (entrance && document.getElementById('custEntrance') && !document.getElementById('custEntrance').value) {
            document.getElementById('custEntrance').value = entrance;
        }
    } catch (err) {
        console.error("Error loading profile:", err);
    }
}

async function saveProfile() {
    if (!sb || !currentUser) return;
    
    clearAllErrors('profileModal');
    
    const nameValid = validateField('profileName', { req: true });
    const phoneValid = validateField('profilePhone', { req: true, phone: true });
    
    if (!nameValid || !phoneValid) return;
    
    const name = document.getElementById('profileName').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const address = document.getElementById('profileAddress').value.trim();
    const apt = document.getElementById('profileApt').value.trim();
    const floor = document.getElementById('profileFloor').value.trim();
    const entrance = document.getElementById('profileEntrance').value.trim();
    
    try {
        const { error } = await sb.from('profiles')
            .update({ 
                full_name: name,
                phone: phone,
                address: address,
                apt: apt,
                floor: floor,
                entrance: entrance
            })
            .eq('id', currentUser.id);
            
        if (error) throw error;
        alert(t('alertProfileUpdated'));
        await checkSession();
    } catch (err) {
        alert(t('alertError') + err.message);
    }
}

async function changePassword() {
    if (!sb || !currentUser) return;
    
    clearAllErrors('settingsModal');
    
    const oldValid = validateField('oldPassword', { req: true });
    const newValid = validateField('newPassword', { req: true, minLen: 6 });
    const confirmValid = validateField('confirmNewPassword', { req: true, match: 'newPassword' });
    
    if (!oldValid || !newValid || !confirmValid) return;
    
    const oldPass = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;
    
    const btn = document.getElementById('changePassBtn');
    btn.disabled = true;
    btn.innerText = '...';
    
    try {
        const { error: authError } = await sb.auth.signInWithPassword({
            email: currentUser.email,
            password: oldPass
        });
        
        if (authError) throw new Error(t('validationEmpty')); // Or better key if needed
        
        const { error: updateError } = await sb.auth.updateUser({
            password: newPass
        });
        
        if (updateError) throw updateError;
        
        alert(t('alertPassChanged'));
        closeSettingsModal();
        
    } catch (err) {
        alert(t('alertError') + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = t('settingsUpdateBtn');
    }
}

async function loadUserOrders() {
    if (!sb || !currentUser) return;
    
    const container = document.getElementById('userOrderHistory');
    container.innerHTML = '<div class="text-center py-4 text-muted animate-pulse">⏳...</div>';
    
    try {
        const { data, error } = await sb.from('orders')
            .select('*')
            .eq('customer_email', currentUser.email)
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = `<div class="text-center py-8 text-muted text-[10px] uppercase font-bold tracking-widest opacity-50 italic">${t('profileOrdersEmpty')}</div>`;
            return;
        }
        
        container.innerHTML = data.map((order, idx) => {
            const orderJson = JSON.stringify(order).replace(/'/g, "&apos;");
            const date = new Date(order.created_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ru-RU');
            
            // Status Mapping
            let statusText = '';
            let statusColor = '';
            
            switch(order.status) {
                case 'new':
                    statusText = t('statusNew');
                    statusColor = 'text-brand border-brand/20 bg-brand/5';
                    break;
                case 'Готовится':
                    statusText = t('statusCooking');
                    statusColor = 'text-amber-500 border-amber-500/20 bg-amber-500/5';
                    break;
                case 'Курьер в пути':
                    statusText = t('statusTransit');
                    statusColor = 'text-blue-500 border-blue-500/20 bg-blue-500/5';
                    break;
                case 'Завершен':
                    statusText = t('statusCompleted');
                    statusColor = 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
                    break;
                default:
                    statusText = order.status;
                    statusColor = 'text-muted border-white/10 bg-white/5';
            }
            
            return `
                <div class="bg-card/50 border border-white/5 rounded-2xl p-4 space-y-2 group hover:border-brand/20 transition-all cursor-pointer active:scale-[0.98]" 
                     onclick='openOrderDetailsModal(${orderJson})'>
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] font-black uppercase text-muted tracking-widest">${date}</span>
                        <span class="text-[10px] font-black uppercase tracking-widest ${statusColor} border px-2 py-0.5 rounded-full shadow-sm">${statusText}</span>
                    </div>
                    <div class="text-[12px] font-bold text-white/80 line-clamp-1">${order.total_sum}₪ • ${order.order_type}</div>
                    <div class="text-[9px] text-muted font-medium line-clamp-2 italic opacity-60">${(order.items_json.order_items || '').split('\n')[0]}...</div>
                    <div class="text-[8px] text-brand/50 font-black uppercase tracking-widest pt-1 flex items-center gap-1 group-hover:text-brand transition-colors">
                        ${currentLang === 'en' ? 'View details' : 'Подробнее'}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-2 h-2">
                             <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (err) {
        container.innerHTML = `<div class="text-center py-4 text-brand text-[8px] uppercase font-black tracking-widest">${t('alertError')} load orders</div>`;
        console.error(err);
    }
}

function openImageModal(url) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;

    img.src = url;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    
    // Smooth entry animation
    setTimeout(() => {
        img.classList.remove('scale-90', 'translate-y-10', 'opacity-0');
        img.classList.add('scale-100', 'translate-y-0', 'opacity-100');
    }, 50);

    // Disable body scroll
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;

    img.classList.add('scale-90', 'translate-y-10', 'opacity-0');
    img.classList.remove('scale-100', 'translate-y-0', 'opacity-100');

    setTimeout(() => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }, 300);
}

// Accessibility Functions
let fontSizeLevel = 1;
const activeModes = new Set();

function toggleAccessibilityModal() {
    const modal = document.getElementById('accessibilityModal');
    const content = document.getElementById('accessibilityPanelContent');
    if (!modal) return;

    if (modal.classList.contains('opacity-0')) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        content.classList.remove('translate-y-20');
        content.classList.add('translate-y-0');
        document.body.style.overflow = 'hidden';
    } else {
        content.classList.remove('translate-y-0');
        content.classList.add('translate-y-20');
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
        }, 300);
    }
}

function toggleAccessMode(mode, el) {
    const className = `accessibility-${mode}`;
    const isActive = document.body.classList.toggle(className);
    
    if (isActive) {
        activeModes.add(mode);
        if (el) el.classList.add('active-mode', 'ring-2', 'ring-blue-500');
    } else {
        activeModes.delete(mode);
        if (el) el.classList.remove('active-mode', 'ring-2', 'ring-blue-500');
    }
    
    updateAccessibilityTrigger();
}

function updateAccessibilityTrigger() {
    const trigger = document.getElementById('accessibilityToggle');
    const existingCheck = trigger.querySelector('.accessibility-check-mark');
    
    if (activeModes.size > 0 || fontSizeLevel !== 1) {
        if (!existingCheck) {
            const check = document.createElement('div');
            check.className = 'accessibility-check-mark';
            check.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="white" class="w-2 h-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            `;
            trigger.appendChild(check);
            trigger.classList.add('border-blue-500');
        }
    } else {
        if (existingCheck) existingCheck.remove();
        trigger.classList.remove('border-blue-500');
    }
}

function adjustFontSize(direction) {
    if (direction === 'plus' && fontSizeLevel < 1.4) {
        fontSizeLevel += 0.1;
    } else if (direction === 'minus' && fontSizeLevel > 0.8) {
        fontSizeLevel -= 0.1;
    }
    updateFontSize();
}

function resetFontSize() {
    fontSizeLevel = 1;
    updateFontSize();
}

function updateFontSize() {
    document.documentElement.style.fontSize = fontSizeLevel + 'em';
    updateAccessibilityTrigger();
}

function resetAccessibility() {
    // Clear all mode classes
    activeModes.forEach(mode => {
        document.body.classList.remove(`accessibility-${mode}`);
    });
    activeModes.clear();
    
    // Stop speaking
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    // Clear UI active states
    const buttons = document.querySelectorAll('#accessibilityModal .active-mode');
    buttons.forEach(btn => btn.classList.remove('active-mode', 'ring-2', 'ring-blue-500'));
    
    resetFontSize();
}

// Screen Reader Helper
let lastSpokenText = "";
function initScreenReader() {
    const handleSpeak = (e) => {
        if (!activeModes.has('screen-reader')) return;
        
        let target = e.target.closest('p, h1, h2, h3, h4, span, button, a, label');
        if (!target) return;
        
        const text = target.innerText || target.getAttribute('aria-label') || target.getAttribute('title');
        if (text && text !== lastSpokenText) {
            lastSpokenText = text;
            speakText(text);
        }
    };

    document.addEventListener('mouseover', handleSpeak);
    document.addEventListener('click', (e) => {
        if (activeModes.has('screen-reader')) {
            // Stop current speech and force immediate read on click
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            handleSpeak(e);
        }
    });
}

function speakText(text) {
    if (!window.speechSynthesis) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();
    
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    uttr.rate = 1.0;
    uttr.pitch = 1.0;
    
    window.speechSynthesis.speak(uttr);
}

// Initialize on load
initScreenReader();

let isSiteDisabled = false;

function showDisabledSiteModal() {
    isSiteDisabled = true;
    
    // 1. Dim main content
    const bodyChildren = document.body.children;
    for (let i = 0; i < bodyChildren.length; i++) {
        const el = bodyChildren[i];
        if (el.tagName !== 'SCRIPT' && el.id !== 'disabledSiteModal' && !el.classList.contains('fixed-sys-modal')) {
            el.style.opacity = '0.3';
            el.style.pointerEvents = 'none';
            el.style.filter = 'grayscale(0.5)';
            el.style.transition = 'all 0.5s ease-in-out';
        }
    }

    // 2. Insert modal
    const modal = document.createElement('div');
    modal.id = 'disabledSiteModal';
    modal.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in bg-black/60 backdrop-blur-sm pointer-events-auto fixed-sys-modal';
    
    modal.innerHTML = `
        <div class="bg-dark border border-amber-500/30 shadow-[0_0_80px_rgba(245,158,11,0.15)] w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 text-center flex flex-col items-center relative overflow-hidden transform transition-transform scale-100">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full"></div>
            <div class="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner bg-amber-500/10 text-amber-500 border border-amber-500/20 relative z-10 animate-pulse">
                ⏳
            </div>
            <h2 class="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight mb-4 relative z-10">
                Готовим с любовью, но сейчас —<br><span class="text-amber-500">очень стараемся успеть!</span>
            </h2>
            <div class="w-16 h-1.5 bg-amber-500 rounded-full mb-6 relative z-10"></div>
            <div class="space-y-4 text-white/80 font-medium leading-relaxed text-sm relative z-10">
                <p>Друзья, мы получили очень много заказов и хотим, чтобы каждый из них был выполнен идеально. Чтобы не подвести вас и сохранить качество, мы временно приостановили прием новых чеков.</p>
                <p>Пожалуйста, загляните к нам чуть позже — мы скоро разберемся с текущими заказами и снова будем в строю. Приносим извинения за неудобства!</p>
            </div>
            <div class="mt-8 pt-6 border-t border-white/10 w-full relative z-10">
                <p class="text-[#25D366] text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Ваш уже оформленный заказ в работе и будет доставлен вовремя
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}
