const mealDatabase = {
    'italian-fettuccine': { name: 'Fettuccine Alfredo', price: 950, image: 'mealimages/fettucini alfredo.png' },
    'italian-pizza': { name: 'Margherita Pizza (Slice)', price: 650, image: 'mealimages/margheritapizza.png' },
    'italian-risotto': { name: 'Mushroom Risotto', price: 1100, image: 'mealimages/mushroomrisotto.png' },
    'italian-lasagna': { name: 'Beef Lasagna Bolognese', price: 1200, image: 'mealimages/lasagnabolognese.png' },
    'chinese-lomein': { name: 'Vegetable Lo Mein', price: 850, image: 'mealimages/lo mein.png' },
    'chinese-friedrice': { name: 'Shrimp Fried Rice', price: 1050, image: 'mealimages/shrimprice.png' },
    'chinese-sweetsour': { name: 'Sweet & Sour Chicken', price: 950, image: 'mealimages/sweetandsourchicken.png' },
    'mexican-tacos': { name: 'Street Style Tacos (2 pieces)', price: 800, image: 'mealimages/taco.png' },
    'mexican-quesadilla': { name: 'Chicken Fajita Quesadillas', price: 900, image: 'mealimages/quesadilla.png' },
    'mexican-burrito': { name: 'Supreme Cali Burrito', price: 1100, image: 'mealimages/burritto.png' },
    'mexican-nachos': { name: 'Loaded Nachos (Single Serving)', price: 750, image: 'mealimages/nachos.png' },
    'american-burger': { name: 'Classic Cheeseburger', price: 900, image: 'mealimages/burger.png' },
    'american-steak': { name: 'Ribeye Steak (Medium Cut)', price: 1850, image: 'mealimages/ribeyesteak.png' },
    'american-bbq': { name: 'Pulled Pork BBQ Plate', price: 1300, image: 'mealimages/TexasBrisket.png' },
    'american-mac': { name: 'Truffle Mac & Cheese', price: 850, image: 'mealimages/mac&cheese.png' },
    'pakistani-biryani': { name: 'Chicken Biryani', price: 1050, image: 'mealimages/biryani.png' },
    'pakistani-karahi': { name: 'Mutton Karahi', price: 1350, image: 'mealimages/karahi.png' },
    'pakistani-nihari': { name: 'Beef Nihari', price: 1200, image: 'mealimages/nihari.png' },
    'pakistani-kebab': { name: 'Seekh Kebabs (2 pieces)', price: 900, image: 'mealimages/kebabs.png' },
    'pakistani-haleem': { name: 'Mutton Haleem', price: 1100, image: 'mealimages/beef haleem.png' }
};

function getCart() {
    try {
        const cartData = localStorage.getItem('mealItCart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('mealItCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function addToCart(mealId, mealName, mealPrice) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === mealId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: mealId, name: mealName, price: mealPrice, quantity: 1 });
    }

    saveCart(cart);
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any meals yet.</p>
                <a href="menu.html" class="continue-shopping">Browse Our Menu</a>
            </div>
        `;
        updateSummary();
        return;
    }

    container.innerHTML = cart.map(item => {
        const mealData = mealDatabase[item.id];
        const image = mealData ? mealData.image : 'mealimages/placeholder.png';

        return `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/120'">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">Rs. ${item.price.toFixed(2)} each</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">−</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                        <div style="margin-left: auto; font-weight: 600; font-size: 1.1rem; color: #ff6b35;">
                            Rs. ${(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateSummary();
}

function increaseQuantity(itemId) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += 1;
        saveCart(cart);
        renderCart();
        updateCartBadge();
    }
}

function decreaseQuantity(itemId) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart(cart);
            renderCart();
            updateCartBadge();
        } else {
            removeFromCart(itemId);
        }
    }
}

function removeFromCart(itemId) {
    const cart = getCart();
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCart(cart);
        renderCart();
        updateCartBadge();
        showNotification(`${itemName} removed from cart`, 'error');
    }
}

function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const delivery = subtotal > 0 ? 200 : 0;
    const total = subtotal + tax + delivery;

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const deliveryEl = document.getElementById('delivery');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `Rs. ${tax.toFixed(2)}`;
    if (deliveryEl) deliveryEl.textContent = `Rs. ${delivery.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `Rs. ${total.toFixed(2)}`;

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        notification.textContent = message;
        notification.className = `cart-notification ${type} show`;
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function () {
                const mealId = this.getAttribute('data-meal-id');
                const mealName = this.getAttribute('data-meal-name');
                const mealPrice = parseFloat(this.getAttribute('data-meal-price'));
                addToCart(mealId, mealName, mealPrice);
                showNotification(`✓ ${mealName} added to cart!`, 'success');
            });
        });
    }

    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (cartItemsContainer) {
        renderCart();
    }

    updateCartBadge();

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            const cart = getCart();
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = total * 0.05;
            const delivery = 200;
            const grandTotal = total + tax + delivery;

            alert(`Order Confirmed!\n\nSubtotal: Rs. ${total.toFixed(2)}\nTax (5%): Rs. ${tax.toFixed(2)}\nDelivery: Rs. ${delivery.toFixed(2)}\nTotal: Rs. ${grandTotal.toFixed(2)}\n\nThank you for your order! We'll start preparing your meals right away.`);

            saveCart([]);
            renderCart();
            updateCartBadge();
        });
    }
});