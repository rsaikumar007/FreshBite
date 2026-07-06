// ===== CART MANAGEMENT =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartBadge = document.getElementById("cart-badge");
const cartItemsList = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// Update cart badge count
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = count;
}

// Update cart display
function updateCartDisplay() {
  updateCartBadge();
  
  if (cart.length === 0) {
    cartItemsList.innerHTML = '<div class="text-center text-muted py-5"><i class="fas fa-shopping-bag fa-3x mb-3 opacity-50"></i><p>Your cart is empty</p></div>';
    cartSubtotal.textContent = "₹0";
    cartTotal.textContent = "₹40";
    return;
  }

  cartItemsList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <div class="flex-grow-1">
        <div class="cart-item-name">${item.name}</div>
        <small class="text-muted">₹${item.price} × ${item.quantity}</small>
      </div>
      <div class="text-end">
        <div class="cart-item-price">₹${item.price * item.quantity}</div>
        <div class="btn-group btn-group-sm mt-2" role="group">
          <button class="btn btn-outline-secondary btn-sm decrease-qty" data-index="${index}">−</button>
          <button class="btn btn-outline-secondary btn-sm disabled">${item.quantity}</button>
          <button class="btn btn-outline-secondary btn-sm increase-qty" data-index="${index}">+</button>
        </div>
        <button class="btn btn-link btn-sm text-danger mt-2 remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    cartItemsList.appendChild(itemElement);
  });

  cartSubtotal.textContent = `₹${subtotal}`;
  cartTotal.textContent = `₹${subtotal + 40}`;
  
  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart
function addToCart(name, price) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartDisplay();
  
  // Show toast notification
  showToast(`${name} added to cart!`);
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

// Increase quantity
function increaseQuantity(index) {
  if (cart[index]) {
    cart[index].quantity += 1;
    updateCartDisplay();
  }
}

// Decrease quantity
function decreaseQuantity(index) {
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      removeFromCart(index);
    }
    updateCartDisplay();
  }
}

// Toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white rounded shadow";
  toast.style.zIndex = "9999";
  toast.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// ===== MENU SEARCH & FILTER =====
const menuSearch = document.getElementById("menu-search");
const clearSearchBtn = document.getElementById("clear-search");
const menuGrid = document.getElementById("menu-grid");

if (menuSearch) {
  menuSearch.addEventListener("input", () => {
    const query = menuSearch.value.toLowerCase();
    document.querySelectorAll(".menu-card").forEach((card) => {
      const name = card.dataset.name.toLowerCase();
      const description = card.querySelector(".menu-content p").textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll(".badge")).map(b => b.textContent.toLowerCase()).join(" ");
      
      const matches = name.includes(query) || description.includes(query) || tags.includes(query);
      card.style.display = matches ? "" : "none";
    });
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    menuSearch.value = "";
    menuSearch.dispatchEvent(new Event("input"));
  });
}

// ===== ADD TO CART BUTTONS =====
document.addEventListener("click", (e) => {
  if (e.target.closest(".add-cart")) {
    const card = e.target.closest(".menu-card");
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    addToCart(name, price);
  }
  
  // Quantity controls
  if (e.target.closest(".increase-qty")) {
    const index = parseInt(e.target.closest(".increase-qty").dataset.index);
    increaseQuantity(index);
  }
  
  if (e.target.closest(".decrease-qty")) {
    const index = parseInt(e.target.closest(".decrease-qty").dataset.index);
    decreaseQuantity(index);
  }
  
  if (e.target.closest(".remove-item")) {
    const index = parseInt(e.target.closest(".remove-item").dataset.index);
    removeFromCart(index);
  }
});

// ===== CHECKOUT =====
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Please add items to your cart first!");
      return;
    }
    
    // Update modal with current cart totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("modal-subtotal").textContent = `₹${subtotal}`;
    document.getElementById("modal-total").textContent = `₹${subtotal + 40}`;
    
    // Show modal
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
  });
}

// Complete Payment
const completePaymentBtn = document.getElementById("complete-payment-btn");
if (completePaymentBtn) {
  completePaymentBtn.addEventListener("click", () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 40;
    const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join("\n");
    
    showToast("🎉 Order Confirmed! Your food will arrive in 30 minutes.");
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    localStorage.removeItem("cart");
    
    // Close modal
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    if (checkoutModal) {
      checkoutModal.hide();
    }
    
    // Close cart offcanvas
    const cartOffcanvas = document.getElementById("cartOffcanvas");
    if (cartOffcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(cartOffcanvas);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  });
}

// ===== NEWSLETTER =====
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;
    if (email) {
      showToast(`Subscribed with ${email}!`);
      newsletterForm.reset();
    }
  });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.style.background = "linear-gradient(90deg, rgba(255,255,255,0.99), rgba(255,255,255,0.98))";
    navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)";
  } else {
    navbar.style.background = "linear-gradient(90deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))";
    navbar.style.boxShadow = "0 2px 15px rgba(0,0,0,0.08)";
  }
});

// ===== SCROLL REVEAL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "slideUp 0.6s ease forwards";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".section").forEach((section) => {
  observer.observe(section);
});

// Add animation keyframes dynamically
const style = document.createElement("style");
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ===== INITIALIZE =====
updateCartDisplay();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
