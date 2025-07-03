function signup(e) {
  e.preventDefault();
  const username = document.getElementById("signupUser").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPass").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(user => user.email === email)) {
    alert("This email is already registered.");
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! Please log in.");
  showPage('loginPage');
}

function login(e) {
  e.preventDefault();
  const email = document.getElementById("loginUser").value.trim().toLowerCase();
  const password = document.getElementById("loginPass").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{6,}$/;

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email.");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert("Password must be at least 6 characters, include a letter and a special character.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  showToast("🎉 Welcome back! You are logged in.");
  localStorage.setItem("loggedIn", "true");
  showPage('homePage');
  updateCartWishlistCount();
}

function resetPassword(e) {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email);
  if (user) {
    alert("Password reset link sent to " + email);
  } else {
    alert("Email not found. Please check or register.");
  }
  showPage('loginPage');
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loggedInUser");
  showToast("👋 Logged out successfully!");
  showPage("loginPage");
  updateCartWishlistCount();
}

function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("active");
}

function viewAll(category) {
  const scrollSection = [...document.querySelectorAll('.product-category')].find(section =>
    section.querySelector('h3')?.textContent?.toLowerCase().includes(category)
  );
  if (scrollSection) {
    scrollSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function searchProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const name = card.querySelector("h4").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "block" : "none";
  });
}

let currentProduct = {};

function showProductDetail(name, price, image) {
  currentProduct = { name, price, image };
  document.getElementById("viewProductImage").src = image;
  document.getElementById("viewProductName").textContent = name;
  document.getElementById("viewProductPrice").textContent = price;
  document.getElementById("viewProductDescription").textContent =
    "This is a high-quality product designed with care. Enjoy reliable performance and stylish design.";
  showPage("viewProductPage");
}

function closeDetail() {
  document.getElementById("productDetail").classList.add("hidden");
}

function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedSize = document.getElementById("sizeSelect")?.value || "M";

  const product = {
    ...currentProduct,
    size: selectedSize
  };

  const existingProduct = cart.find(p =>
    p.name === product.name &&
    p.image === product.image &&
    p.size === product.size
  );

  if (existingProduct) {
    existingProduct.qty = (existingProduct.qty || 1) + 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart!");
  updateCartWishlistCount(); 
  closeDetail();
}


function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Check if already exists
  const alreadyInWishlist = wishlist.some(item =>
    item.title === product.title && item.size === product.size
  );

  if (alreadyInWishlist) {
    showToast("✅ Already in wishlist!");
    return;
  }

  wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  showToast("❤️ Added to wishlist");
  updateWishlistCount();
  renderWishlist();
}


function addToCartFromView() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedSize = document.getElementById("sizeSelect")?.value || "M";

  const product = {
    ...currentProduct,
    size: selectedSize
  };

  const existingProduct = cart.find(p =>
    p.name === product.name &&
    p.image === product.image &&
    p.size === product.size
  );

  if (existingProduct) {
    existingProduct.qty = (existingProduct.qty || 1) + 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("🛒 Added to Cart!");
  updateCartWishlistCount();
}


function addToWishlistFromView() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.push(currentProduct);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  showToast("Added to Wishlist!");
  updateCartWishlistCount(); 
}

function buyNow() {
  const selectedSize = document.getElementById("sizeSelect").value || "M";
  const productToBuy = { ...currentProduct, size: selectedSize };

  localStorage.setItem("buyNowProduct", JSON.stringify(productToBuy));
  window.location.href = "buynow.html";
}



function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 3000);
}

function showPage(id) {
  document.querySelectorAll('.container, #homePage').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.getElementById("productDetail").classList.add("hidden");

  if (id === "cartPage") loadCart();
  if (id === "wishlistPage") loadWishlist();
  updateCartWishlistCount(); 
}

function loadCart() {
  const items = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");

  if (items.length === 0) {
    container.innerHTML = "<p>No items in cart.</p>";
    return;
  }

  container.innerHTML = items
    .map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>${item.price}</p>
          <p>Size: ${item.size || "M"}</p>
          <p>Qty: ${item.qty || 1}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `).join("");
     updateCartSummary();
}
window.addEventListener("DOMContentLoaded", function () {
  showPage("cartPage");
  loadCart(); // Your custom function that renders cart items
});


function loadWishlist() {
  const items = JSON.parse(localStorage.getItem("wishlist")) || [];
  const container = document.getElementById("wishlistItems");

  if (items.length === 0) {
    container.innerHTML = "<p>No items in wishlist.</p>";
    return;
  }

  container.innerHTML = items
    .map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>${item.price}</p>
        </div>
        <button class="remove-btn" onclick="removeFromWishlist(${index})">Remove</button>
      </div>
    `).join("");
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartWishlistCount(); 
}

function removeFromWishlist(index) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  loadWishlist();
  updateCartWishlistCount(); 
}

function updateCartWishlistCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("wishlistCount").textContent = wishlist.length;
}

function sortProducts() {
  const sortValue = document.getElementById("sortSelect").value;
  const productContainers = document.querySelectorAll(".product-scroll");

  productContainers.forEach(container => {
    const products = Array.from(container.querySelectorAll(".product-card"));

    products.sort((a, b) => {
      if (sortValue === "priceAsc" || sortValue === "priceDesc") {
        const priceA = parseInt(a.querySelector(".current-price").innerText.replace(/[^\d]/g, ""));
        const priceB = parseInt(b.querySelector(".current-price").innerText.replace(/[^\d]/g, ""));
        return sortValue === "priceAsc" ? priceA - priceB : priceB - priceA;
      } else if (sortValue === "nameAsc") {
        return a.querySelector("h4").innerText.localeCompare(b.querySelector("h4").innerText);
      } else if (sortValue === "nameDesc") {
        return b.querySelector("h4").innerText.localeCompare(a.querySelector("h4").innerText);
      }
      return 0;
    });

    products.forEach(product => container.appendChild(product));
  });
}

function submitReview() {
  const text = document.getElementById("reviewText").value.trim();
  if (!text) {
    alert("Please enter a review.");
    return;
  }

  const reviews = JSON.parse(localStorage.getItem("productReviews")) || {};
  const productName = currentProduct.name;

  if (!reviews[productName]) {
    reviews[productName] = [];
  }

  reviews[productName].push(text);
  localStorage.setItem("productReviews", JSON.stringify(reviews));
  document.getElementById("reviewText").value = "";
  showToast("✅ Review submitted!");
  displayReviews(productName);
}

function displayReviews(productName) {
  const reviews = JSON.parse(localStorage.getItem("productReviews")) || {};
  const reviewList = reviews[productName] || [];

  const container = document.getElementById("reviewList");
  container.innerHTML = reviewList.length
    ? reviewList.map(r => `<li>⭐ ${r}</li>`).join("")
    : "<li>No reviews yet.</li>";
}

function toggleReviewList() {
  const section = document.getElementById("reviewSection");
  section.classList.toggle("hidden");

  if (!section.classList.contains("hidden")) {
    displayReviews(currentProduct.name);
  }
}

function triggerWishlistBubble() {
  addToWishlistFromView();
  const bubble = document.querySelector(".wishlist-bubble");
  bubble.classList.remove("animate");
  void bubble.offsetWidth;
  bubble.classList.add("animate");
}

function viewDetail(name, price, image) {
  localStorage.setItem("selectedProduct", JSON.stringify({ name, price, image }));
  window.location.href = "index.html#viewProduct";
}

window.onload = function () {
  updateCartWishlistCount(); 

  if (localStorage.getItem("loggedIn") === "true") {
    if (window.location.hash === "#viewProduct") {
      const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
      if (selectedProduct) {
        showProductDetail(selectedProduct.name, selectedProduct.price, selectedProduct.image);
      }
    } else {
      showPage("homePage");
    }
  } else {
    showPage("loginPage");
  }
};
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('cat');
const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
let filtered = allProducts.filter(p => p.category === category);

document.getElementById("categoryTitle").textContent = `Top Picks for ${category}`;
const container = document.getElementById("categoryProducts");
const pagination = document.getElementById("pagination");

let currentPage = 1;
const productsPerPage = 5;

function displayProducts() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = filtered.slice(start, end);

  container.innerHTML = currentProducts.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="product-price"><span class="current-price">${p.price}</span></div>
      <button class="view-button" onclick="viewDetail('${p.name}', '${p.price}', '${p.image}')">View</button>
    </div>
  `).join('');

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const pageInfo = document.getElementById("pageInfo");
  const pagination = document.getElementById("pagination");

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  pagination.innerHTML = "";

  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "PREV";
    prev.classList.add("nav-btn");
    prev.onclick = () => {
      currentPage--;
      displayProducts();
    };
    pagination.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      displayProducts();
    };
    pagination.appendChild(btn);
  }

  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "NEXT";
    next.classList.add("nav-btn");
    next.onclick = () => {
      currentPage++;
      displayProducts();
    };
    pagination.appendChild(next);
  }
}


function viewDetail(name, price, image) {
  localStorage.setItem("selectedProduct", JSON.stringify({ name, price, image }));
  window.location.href = "index.html#viewProduct";
}

function sortCategoryProducts() {
  const sortValue = document.getElementById("categorySortSelect").value;
  if (sortValue === "priceAsc") {
    filtered.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  } else if (sortValue === "priceDesc") {
    filtered.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  } else if (sortValue === "nameAsc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "nameDesc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }
  currentPage = 1;
  displayProducts();
}

function searchCategoryProducts() {
  const query = document.getElementById("categorySearchInput").value.toLowerCase();
  filtered = allProducts.filter(p => p.category === category && p.name.toLowerCase().includes(query));
  currentPage = 1;
  displayProducts();
}

displayProducts();
function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let totalItems = 0;
  let totalPrice = 0;
  let totalDiscount = 0;

  cart.forEach(item => {
    const qty = item.qty || 1;
    const price = parseInt(item.price.replace(/[₹,]/g, ""));
    const originalPrice = 999; // Assuming original price for discount is ₹999
    const discountPerItem = originalPrice - price;

    totalItems += qty;
    totalPrice += price * qty;
    totalDiscount += discountPerItem * qty;
  });

  document.getElementById("itemCount").textContent = totalItems;
  document.getElementById("productPrice").textContent = `₹${totalPrice}`;
  document.getElementById("discount").textContent = `- ₹${totalDiscount}`;
  document.getElementById("orderTotal").textContent = `₹${totalPrice}`;
  document.getElementById("discountValue").textContent = totalDiscount;
}

  function toggleNavbar() {
    const navIcons = document.getElementById("navIcons");
    const toggleBtn = document.getElementById("menuToggle");

    navIcons.classList.toggle("show");
    toggleBtn.classList.toggle("open");
  }

