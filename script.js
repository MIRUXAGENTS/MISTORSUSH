let cart = {}; 

function init() {
    renderNav();
    renderMenu();
    updateCartWidget();
    observeCategories();
}

function renderNav() {
    const nav = document.getElementById('categoryNav');
    nav.innerHTML = menuData.map((cat, index) => `
        <a href="#cat-${index}" class="category-link whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${index===0 ? 'text-brand border-brand/30 bg-brand/10' : 'text-muted border-white/5 bg-card hover:bg-white/5'}">
            ${cat.category}
        </a>
    `).join('');
}

function renderMenu() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = menuData.map((cat, index) => `
        <section id="cat-${index}" class="scroll-mt-36 menu-section">
            <h2 class="text-2xl font-bold mb-6 tracking-tight text-white/95 flex items-center justify-center gap-4 text-center uppercase text-[22px]">
                <div class="h-px bg-white/10 flex-grow"></div>
                ${cat.category}
                <div class="h-px bg-white/10 flex-grow"></div>
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                ${cat.items.map(item => `
                    <div class="product-card flex flex-col justify-between bg-card p-4 rounded-2xl border border-white/5 shadow-lg shadow-black/20">
                        <div class="mb-3">
                            <h3 class="font-bold text-[17px] leading-snug mb-1.5 text-white/95">${item.name}</h3>
                            <p class="text-xs text-muted leading-relaxed line-clamp-3">${item.ingredients}</p>
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
    `).join('');
}

function observeCategories() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const navLinks = document.querySelectorAll('.category-link');
                navLinks.forEach(a => {
                    a.classList.remove('text-brand', 'border-brand/30', 'bg-brand/10');
                    a.classList.add('text-muted', 'border-white/5', 'bg-card');
                });
                
                const activeLink = document.querySelector(`#categoryNav a[href="#${entry.target.id}"]`);
                if(activeLink) {
                    activeLink.classList.remove('text-muted', 'border-white/5', 'bg-card');
                    activeLink.classList.add('text-brand', 'border-brand/30', 'bg-brand/10');
                }
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });
    
    document.querySelectorAll('.menu-section').forEach(sec => observer.observe(sec));
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
    
    if (totalItems === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-48 text-center pt-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14 text-muted mb-4 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                <p class="text-white/60 font-medium tracking-wide">Ваша корзина пуста :(</p>
                <p class="text-xs text-white/30 mt-1">Добавьте роллы, чтобы сделать заказ</p>
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
                        Акция 2+1 (Пятница):
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
    
    let orderText = "🍣 *Новый заказ Mistorsush!* 🍣\n\n";
    orderText += `*Имя:* ${name}\n`;
    orderText += `*Телефон:* ${phone}\n`;
    orderText += `*Получение:* ${orderType === 'delivery' ? 'Доставка 🚚' : 'Самовывоз 🚶‍♂️'}\n\n`;
    
    if (orderType === 'delivery') {
        const address = document.getElementById('custAddress').value.trim();
        const apt = document.getElementById('custApt').value.trim();
        const floor = document.getElementById('custFloor').value.trim();
        const entrance = document.getElementById('custEntrance').value.trim();
        
        orderText += `📍 *Актуальный Адрес:* ${address}`;
        if(apt) orderText += `, Кв. ${apt}`;
        if(floor) orderText += `, Этаж ${floor}`;
        if(entrance) orderText += `, Подъезд ${entrance}`;
        orderText += `\n\n`;
    }
    
    let totalPrice = 0;
    orderText += `*Ваш заказ:*\n`;
    for (const [id, count] of Object.entries(cart)) {
        if (count > 0) {
            const item = getItem(id);
            if (item) {
                orderText += `— ${item.name} x${count} (${item.price * count}₪) \n`;
                totalPrice += (item.price * count);
            }
        }
    }
    
    const discount = calculateDiscount();
    if (discount > 0) {
        orderText += `\n🎁 *Акция 2+1 (Пятница):* -${discount}₪\n`;
    }
    
    const finalSubtotal = totalPrice - discount;
    
    let deliveryCost = 0;
    if (orderType === 'delivery') {
        if (finalSubtotal < 250) {
            deliveryCost = 30;
            orderText += `\n🛵 *Доставка:* 30₪\n`;
        } else {
            orderText += `\n🛵 *Доставка:* 0₪ (Бесплатно!)\n`;
        }
    }
    
    const finalPrice = finalSubtotal + deliveryCost;
    
    let comment = document.getElementById('custComment').value.trim();
    if(comment) {
        orderText += `\n💬 *Комментарий:* ${comment}\n`;
    }
    
    orderText += `\n💰 *Итого к оплате:* ${finalPrice}₪`;
    
    const businessPhone = "972559284670";
    const url = `https://wa.me/${businessPhone}?text=${encodeURIComponent(orderText)}`;
    
    // Clear and close
    cart = {};
    updateCartWidget();
    closeCheckoutModal();
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', init);
