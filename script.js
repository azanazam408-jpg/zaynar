// ============ ZAYNAR – FINAL FIXED SCRIPT ============
// FULLY WORKING CART + CHECKOUT + SLIDER + MOBILE NAV
// =====================================================

// LOAD CART FROM LOCAL STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {

  // ELEMENT SELECTORS
  const cartBtn = document.getElementById("cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartListContainer = document.getElementById("cart-list-container");
  const subtotalEl = document.getElementById("subtotal");
  const cartItemCountEl = document.getElementById("cart-item-count");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // ============ CART FUNCTIONS ============

  function openCart() {
    cartSidebar.classList.add("show");
    cartOverlay.classList.add("show");
  }

  function closeCart() {
    cartSidebar.classList.remove("show");
    cartOverlay.classList.remove("show");
  }

  function addToCart(product, price) {
    // prevent duplicate
    const exists = cart.find(item => item.name === product);
    if (exists) {
      alert("This item is already in your bag!");
      return;
    }

    // add
    cart.push({ name: product, price });
    saveCart();
    updateCart();
    openCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // UPDATE CART UI
  function updateCart() {
    cartListContainer.innerHTML = "";

    if (cart.length === 0) {
      cartListContainer.innerHTML = `<p>Your bag is empty.</p>`;
      cartItemCountEl.textContent = "0";
      cartItemCountEl.classList.remove("visible");
      subtotalEl.textContent = "$0.00";
      return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
      subtotal += item.price;

      // Find product image
      let imgSrc = "https://via.placeholder.com/90";

      const btn = Array.from(addToCartButtons).find(b => b.dataset.product === item.name);
      const card = btn ? btn.closest(".product-card") : null;

      if (card) {
        const imgEl = card.querySelector("img");
        if (imgEl) imgSrc = imgEl.src;
      } else {
        const detailImg = document.querySelector(".product-image-large img");
        if (detailImg) imgSrc = detailImg.src;
      }

      const itemEl = document.createElement("div");
      itemEl.classList.add("cart-item");
      itemEl.innerHTML = `
        <img src="${imgSrc}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="price">$${item.price.toFixed(2)}</span>
          <button class="remove-item-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartListContainer.appendChild(itemEl);
    });

    // Update subtotal
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Update bubble count
    cartItemCountEl.textContent = cart.length;
    cartItemCountEl.classList.add("visible");
  }

  // ============ EVENT LISTENERS ============

  cartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  addToCartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.product;
      const price = parseFloat(btn.dataset.price);
      addToCart(name, price);
    });
  });

  cartListContainer.addEventListener("click", e => {
    if (e.target.classList.contains("remove-item-btn")) {
      removeFromCart(parseInt(e.target.dataset.index));
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      saveCart();
      window.location.href = "checkout.html";
    });
  }

  // SHOW CART ON LOAD
  updateCart();



  // ============ SLIDER SECTION ============
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".slider-nav.next");
  const prevBtn = document.querySelector(".slider-nav.prev");
  const dots = document.querySelectorAll(".dot");

  let currentSlide = 0;
  let slideInterval;

  function showSlide(n) {
    if (slides.length === 0) return;

    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;

    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function nextSlide() { currentSlide++; showSlide(currentSlide); }
  function prevSlide() { currentSlide--; showSlide(currentSlide); }

  function startSlideShow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  if (slides.length > 0) {
    nextBtn.addEventListener("click", () => { nextSlide(); startSlideShow(); });
    prevBtn.addEventListener("click", () => { prevSlide(); startSlideShow(); });

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        currentSlide = parseInt(dot.dataset.slide);
        showSlide(currentSlide);
        startSlideShow();
      });
    });

    showSlide(0);
    startSlideShow();
  }



  // ============ MOBILE NAV ============
  hamburgerBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
    const icon = hamburgerBtn.querySelector("i");

    if (mobileNav.classList.contains("show")) {
      icon.classList.remove("fa-bars-staggered");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars-staggered");
    }
  });



  // ============ SCROLL ANIMATIONS ============
  const animatedElements = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  });

  animatedElements.forEach(el => observer.observe(el));

});


// ============ CHECKOUT PAGE LOGIC ============
document.addEventListener("DOMContentLoaded", () => {
  const subtotalBox = document.querySelector(".order-total strong");
  const totalBox = document.querySelector(".grand-total strong");
  const summaryBox = document.querySelector(".order-summary-box");

  if (!summaryBox) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = cart.reduce((acc, item) => acc + item.price, 0);

  const shipping = 5;

  subtotalBox.textContent = `$${subtotal.toFixed(2)}`;
  totalBox.textContent = `$${(subtotal + shipping).toFixed(2)}`;
});


// ============ ORDER FORM ============
const orderForm = document.getElementById("place-order-form");

if (orderForm) {
  orderForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
  });
}


// ============ LOADER ============
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});
