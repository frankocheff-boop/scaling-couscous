/**
 * Chef Franko - Sistema POS
 * Sistema de selección de menú sin precios
 */

// Datos del menú
const menuData = {
    'amuse-bouche': [
        { id: 'ab1', name: 'Tartar de Atún con Aguacate', image: 'https://placehold.co/250x150/D4AF37/FFFFFF?text=Tartar+Atun' },
        { id: 'ab2', name: 'Ceviche de Pescado Blanco', image: 'https://placehold.co/250x150/E67E22/FFFFFF?text=Ceviche' },
        { id: 'ab3', name: 'Carpaccio de Res', image: 'https://placehold.co/250x150/2C3E50/FFFFFF?text=Carpaccio' }
    ],
    'entradas': [
        { id: 'en1', name: 'Ensalada César con Camarón', image: 'https://placehold.co/250x150/27AE60/FFFFFF?text=Cesar' },
        { id: 'en2', name: 'Sopa de Langosta', image: 'https://placehold.co/250x150/E74C3C/FFFFFF?text=Langosta' },
        { id: 'en3', name: 'Pulpo a la Parrilla', image: 'https://placehold.co/250x150/9B59B6/FFFFFF?text=Pulpo' }
    ],
    'platos-mar': [
        { id: 'pm1', name: 'Filete de Pescado en Costra de Hierbas', image: 'https://placehold.co/250x150/3498DB/FFFFFF?text=Pescado' },
        { id: 'pm2', name: 'Camarones al Ajillo', image: 'https://placehold.co/250x150/E67E22/FFFFFF?text=Camarones' },
        { id: 'pm3', name: 'Risotto de Mariscos', image: 'https://placehold.co/250x150/1ABC9C/FFFFFF?text=Risotto' }
    ],
    'platos-tierra': [
        { id: 'pt1', name: 'Filete Mignon con Reducción de Vino', image: 'https://placehold.co/250x150/8B4513/FFFFFF?text=Filete' },
        { id: 'pt2', name: 'Rack de Cordero', image: 'https://placehold.co/250x150/C0392B/FFFFFF?text=Cordero' },
        { id: 'pt3', name: 'Pechuga de Pato Confitado', image: 'https://placehold.co/250x150/34495E/FFFFFF?text=Pato' }
    ],
    'postres': [
        { id: 'po1', name: 'Lava Cake de Chocolate', image: 'https://placehold.co/250x150/6F4E37/FFFFFF?text=Lava+Cake' },
        { id: 'po2', name: 'Tiramisú Clásico', image: 'https://placehold.co/250x150/D2691E/FFFFFF?text=Tiramisu' },
        { id: 'po3', name: 'Crème Brûlée', image: 'https://placehold.co/250x150/DEB887/FFFFFF?text=Creme+Brulee' }
    ],
    'cocteles': [
        { id: 'co1', name: 'Margarita de Autor', image: 'https://placehold.co/250x150/FFD700/FFFFFF?text=Margarita' },
        { id: 'co2', name: 'Mojito Clásico', image: 'https://placehold.co/250x150/98FF98/FFFFFF?text=Mojito' },
        { id: 'co3', name: 'Old Fashioned', image: 'https://placehold.co/250x150/CD853F/FFFFFF?text=Old+Fashioned' }
    ]
};

const categories = [
    { id: 'amuse-bouche', name: 'Amuse-Bouche', icon: '🍴' },
    { id: 'entradas', name: 'Entradas', icon: '🥗' },
    { id: 'platos-mar', name: 'Platos de Mar', icon: '🐟' },
    { id: 'platos-tierra', name: 'Platos de Tierra', icon: '🥩' },
    { id: 'postres', name: 'Postres', icon: '🍰' },
    { id: 'cocteles', name: 'Cócteles', icon: '🍹' }
];

// Estado del carrito
let cart = {};
let currentCategory = 'amuse-bouche';

/**
 * Inicializar la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage
    loadCart();
    
    // Renderizar categorías
    renderCategories();
    
    // Renderizar menú inicial
    renderMenu(currentCategory);
    
    // Renderizar carrito
    renderCart();
});

/**
 * Cargar carrito desde localStorage
 */
function loadCart() {
    const savedCart = localStorage.getItem('chefFrankoPOSCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

/**
 * Guardar carrito en localStorage
 */
function saveCart() {
    localStorage.setItem('chefFrankoPOSCart', JSON.stringify(cart));
}

/**
 * Renderizar tabs de categorías
 */
function renderCategories() {
    const container = document.getElementById('categoryTabs');
    
    container.innerHTML = categories.map(category => `
        <button 
            class="category-tab ${category.id === currentCategory ? 'active' : ''}"
            onclick="changeCategory('${category.id}')"
        >
            ${category.icon} ${category.name}
        </button>
    `).join('');
}

/**
 * Cambiar categoría activa
 */
function changeCategory(categoryId) {
    currentCategory = categoryId;
    renderCategories();
    renderMenu(categoryId);
}

/**
 * Renderizar items del menú
 */
function renderMenu(categoryId) {
    const container = document.getElementById('menuGrid');
    const items = menuData[categoryId] || [];
    
    container.innerHTML = items.map(item => `
        <div class="menu-item" onclick="addToCart('${item.id}', '${item.name}')">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-content">
                <div class="menu-item-name">${item.name}</div>
                <button class="menu-item-btn">
                    Agregar ${cart[item.id] ? `(${cart[item.id].quantity})` : ''}
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Agregar item al carrito
 */
function addToCart(itemId, itemName) {
    if (cart[itemId]) {
        cart[itemId].quantity++;
    } else {
        cart[itemId] = {
            id: itemId,
            name: itemName,
            quantity: 1,
            category: currentCategory
        };
    }
    
    saveCart();
    renderMenu(currentCategory);
    renderCart();
    
    // Animación de feedback
    showToast(`${itemName} agregado`);
}

/**
 * Remover item del carrito
 */
function removeFromCart(itemId) {
    delete cart[itemId];
    saveCart();
    renderMenu(currentCategory);
    renderCart();
}

/**
 * Incrementar cantidad de item
 */
function incrementItem(itemId) {
    if (cart[itemId]) {
        cart[itemId].quantity++;
        saveCart();
        renderMenu(currentCategory);
        renderCart();
    }
}

/**
 * Decrementar cantidad de item
 */
function decrementItem(itemId) {
    if (cart[itemId]) {
        if (cart[itemId].quantity > 1) {
            cart[itemId].quantity--;
        } else {
            delete cart[itemId];
        }
        saveCart();
        renderMenu(currentCategory);
        renderCart();
    }
}

/**
 * Renderizar carrito
 */
function renderCart() {
    const container = document.getElementById('cartItems');
    const cartCountEl = document.getElementById('cartCount');
    const totalCountEl = document.getElementById('totalCount');
    
    const cartItems = Object.values(cart);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar contadores
    cartCountEl.textContent = cartItems.length;
    totalCountEl.textContent = totalItems;
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🍽️</div>
                <p>Ningún platillo seleccionado</p>
            </div>
        `;
        return;
    }
    
    // Agrupar por categoría
    const groupedByCategory = {};
    cartItems.forEach(item => {
        if (!groupedByCategory[item.category]) {
            groupedByCategory[item.category] = [];
        }
        groupedByCategory[item.category].push(item);
    });
    
    let html = '';
    
    // Renderizar por categoría
    Object.keys(groupedByCategory).forEach(categoryId => {
        const category = categories.find(c => c.id === categoryId);
        const items = groupedByCategory[categoryId];
        
        html += `
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">
                    ${category.icon} ${category.name}
                </div>
        `;
        
        items.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-actions">
                        <button onclick="decrementItem('${item.id}')" class="cart-item-remove" style="background: var(--accent);">
                            −
                        </button>
                        <div class="cart-item-qty">${item.quantity}</div>
                        <button onclick="incrementItem('${item.id}')" class="cart-item-remove" style="background: var(--success);">
                            +
                        </button>
                        <button onclick="removeFromCart('${item.id}')" class="cart-item-remove">
                            ×
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

/**
 * Confirmar selección
 */
function confirmSelection() {
    const cartItems = Object.values(cart);
    
    if (cartItems.length === 0) {
        alert('Por favor seleccione al menos un platillo');
        return;
    }
    
    // Guardar selección con timestamp
    const selection = {
        items: cart,
        timestamp: new Date().toISOString(),
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
    
    // Guardar en localStorage
    let selections = JSON.parse(localStorage.getItem('chefFrankoMenuSelections')) || [];
    selections.push(selection);
    localStorage.setItem('chefFrankoMenuSelections', JSON.stringify(selections));
    
    // Mostrar modal de éxito
    document.getElementById('successModal').classList.add('active');
    
    // Opcional: limpiar carrito después de confirmar
    // clearCart();
}

/**
 * Limpiar carrito
 */
function clearCart() {
    if (Object.keys(cart).length === 0) {
        return;
    }
    
    const confirmation = confirm('¿Desea limpiar toda la selección?');
    if (confirmation) {
        cart = {};
        saveCart();
        renderMenu(currentCategory);
        renderCart();
    }
}

/**
 * Mostrar toast de notificación
 */
function showToast(message) {
    // Crear elemento toast si no existe
    let toast = document.getElementById('posToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'posToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success);
            color: var(--white);
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 5px 15px var(--shadow-dark);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 1500);
}
