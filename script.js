/* ============ ZAYNAR ENGINE ============ */

const products = {
    'patek-silver': { name: 'Patek Philippe Nautilus', price: 450, img: 'img/product 1.jpg' },
    'rado-skeleton': { name: 'Rado True Square', price: 275, img: 'img/IMG-20251104-WA0016.jpg' },
    'rolex-green': { name: 'Rolex Land-Dweller', price: 250, img: 'img/product 3.jpg' },
    'chenxi-chrono': { name: 'Chenxi Chronograph', price: 130, img: 'img/IMG-20251029-WA0013.jpg' },
    'bestwin-gold': { name: 'Bestwin Geometric', price: 150, img: 'New img/golden steps green.jpg' },
    'tissot-gold': { name: 'Tissot 1853 Chrono', price: 220, img: 'New img/golden chain watch.png' },
    'wallet-black': { name: 'Classic Noir Wallet', price: 60, img: 'New img/wallet.png' },
    'wallet-tan': { name: 'Heritage Tan Wallet', price: 45, img: 'New img/wallet 3.png' }
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Init
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScroll();
    updateCartUI();
    setupEvents();
});

// Theme
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') document.body.classList.add('light-theme');
    updateThemeIcon();
}
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    updateThemeIcon();
}
function updateThemeIcon() {
    const btn = document.getElementById('theme-btn');
    if(btn) btn.innerHTML = document.body.classList.contains('light-theme') ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}

// Scroll Animations
function initScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up, .scroll-reveal').forEach(el => observer.observe(el));
}

// Cart Logic
function setupEvents() {
    window.addEventListener('scroll', () => {
        const h = document.getElementById('main-header');
        if(h) window.scrollY > 50 ? h.classList.add('scrolled') : h.classList.remove('scrolled');
    });

    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    
    const toggleDrawer = () => {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    document.getElementById('cart-trigger')?.addEventListener('click', toggleDrawer);
    document.getElementById('close-drawer')?.addEventListener('click', toggleDrawer);
    overlay?.addEventListener('click', toggleDrawer);
    document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);

    // Mobile Menu
    const mm = document.getElementById('mobile-menu');
    document.getElementById('menu-trigger')?.addEventListener('click', () => {
        mm.classList.toggle('active');
    });

    // Add to Cart
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart');
        if(btn) {
            addToCart(btn.dataset.id);
            if(!drawer.classList.contains('active')) toggleDrawer();
        }
        if(e.target.classList.contains('remove-item')) {
            removeFromCart(e.target.dataset.index);
        }
    });
}

function addToCart(id) {
    const p = products[id];
    if(!p) return;
    const exist = cart.find(x => x.id === id);
    exist ? exist.qty++ : cart.push({id, ...p, qty:1});
    saveCart();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const c = document.getElementById('cart-items');
    const t = document.getElementById('cart-total');
    const n = document.getElementById('cart-count');
    if(!c) return;

    let total = 0, count = 0;
    c.innerHTML = cart.length ? '' : '<p class="text-center" style="color:var(--text-secondary); margin-top:50px;">Empty Bag</p>';
    
    cart.forEach((item, i) => {
        total += item.price * item.qty;
        count += item.qty;
        c.innerHTML += `
        <div class="cart-item">
            <img src="${item.img}">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.qty}</p>
                <span class="remove-item" data-index="${i}" style="color:red; cursor:pointer; font-size:0.8rem;">Remove</span>
            </div>
        </div>`;
    });
    
    if(t) t.innerText = `$${total.toFixed(2)}`;
    if(n) n.innerText = count;
}
