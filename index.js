
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
  }function logout() {
  localStorage.removeItem("loggedIn"); 
  alert("Logged out successfully.");
  showPage('loginPage');
}


function toggleMenu() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("active");}
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
  document.getElementById("detailTitle").textContent = name;
  document.getElementById("detailPrice").textContent = price;
  document.getElementById("productDetail").classList.remove("hidden");
  displayReviews(name); // show reviews for selected product

}

function closeDetail() {
  document.getElementById("productDetail").classList.add("hidden");
}

function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(currentProduct);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart!");
  closeDetail();
}

function addToWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.push(currentProduct);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to Wishlist!");
  closeDetail();
}

function showPage(id) {
  document.querySelectorAll('.container, #homePage').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');

  
  document.getElementById("productDetail").classList.add("hidden");

  if (id === "cartPage") loadCart();
  if (id === "wishlistPage") loadWishlist();
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
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `)
    .join("");
}



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
    `)
    .join("");
}

window.onload = function () {
  if (localStorage.getItem("loggedIn") === "true") {
    showPage('homePage');
  } else {
    showPage('loginPage');
  } 
};
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); 
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart(); 
}
function removeFromWishlist(index) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.splice(index, 1); 
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  loadWishlist(); 
}
function showProductDetail(name, price, image) {
  currentProduct = { name, price, image };

  document.getElementById("viewProductImage").src = image;
  document.getElementById("viewProductName").textContent = name;
  document.getElementById("viewProductPrice").textContent = price;
  document.getElementById("viewProductDescription").textContent =
    "This is a high-quality product designed with care. Enjoy reliable performance and stylish design."; 

  showPage("viewProductPage");
  
}

function addToCartFromView() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(currentProduct);
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Added to Cart!");

}

function addToWishlistFromView() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.push(currentProduct);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
 showToast("Added to Wishlist!");

}

function buyNow() {
  alert("Redirecting to payment..."); 
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
}function sortProducts() {
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

    // Re-append sorted cards
    products.forEach(product => container.appendChild(product));
  });
}function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loggedInUser"); // optional

  showToast("👋 Logged out successfully!");
  showPage("loginPage");
}
function triggerWishlistBubble() {
  addToWishlistFromView(); // optional if already adding to wishlist

  const bubble = document.querySelector(".wishlist-bubble");
  bubble.classList.remove("animate");
  void bubble.offsetWidth; // reflow trick to restart animation
  bubble.classList.add("animate");
}const allProducts = [
  { name: 'white shirt', price: '₹253', image: './12.avif', category: 'shirts' },
  { name: 'red shirt', price: '₹700', image: './kk.jpg', category: 'shirts' },
  { name: 'red shirt', price: '₹700', image: './kk.jpg', category: 'shirts' },
  { name: 'blue shirt', price: '₹650', image: './n.jpg', category: 'shirts' },
  { name: 'green shirt', price: '₹600', image: './l.jpg', category: 'shirts' },
  { name: 'black shirt', price: '₹400', image: './k.jpg', category: 'shirts' },
  { name: 'yellow shirt', price: '₹300', image: './hh.jpg', category: 'shirts' },
  { name: 'check shirt', price: '₹200', image: './nimble-made-N0ke5zChVBU-unsplash.jpg', category: 'shirts' },
  { name: 'brown shirt', price: '₹500', image: './phil-monte-4V4t0JcOM5E-unsplash.jpg', category: 'shirts' },
  { name: 'brown shirt', price: '₹500', image: './phil-monte-4V4t0JcOM5E-unsplash.jpg', category: 'shirts' },
  

  { name: 'blue jeans', price: '₹660', image: './j.jpg', category: 'pants' },
  { name: 'blue jeans', price: '₹550', image: './j.jpg', category: 'pants' },
  { name: 'blue jeans', price: '₹450', image: './j.jpg', category: 'pants' },
  { name: 'blue jeans', price: '₹400', image: './j.jpg', category: 'pants' },
  { name: 'blue jeans', price: '₹300', image: './j.jpg', category: 'pants' },
  { name: 'blue jeans', price: '₹800', image: './j.jpg', category: 'pants' },
  { name: 'blue jeans', price: '₹700', image: './j.jpg', category: 'pants' },
  { name: 'blue jeans', price: '₹600', image: './j.jpg', category: 'pants' }
];

localStorage.setItem("allProducts", JSON.stringify(allProducts));

function searchCategoryProducts() {
  const query = document.getElementById("categorySearchInput").value.toLowerCase();
  const cards = document.querySelectorAll("#categoryProducts .product-card");

  cards.forEach(card => {
    const name = card.querySelector("h4").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "block" : "none";
  });
}

function sortCategoryProducts() {
  const sortValue = document.getElementById("categorySortSelect").value;
  const container = document.getElementById("categoryProducts");
  const cards = Array.from(container.querySelectorAll(".product-card"));

  cards.sort((a, b) => {
    const nameA = a.querySelector("h4").textContent;
    const nameB = b.querySelector("h4").textContent;
    const priceA = parseInt(a.querySelector(".current-price").textContent.replace(/[^\d]/g, ""));
    const priceB = parseInt(b.querySelector(".current-price").textContent.replace(/[^\d]/g, ""));

    switch (sortValue) {
      case "priceAsc": return priceA - priceB;
      case "priceDesc": return priceB - priceA;
      case "nameAsc": return nameA.localeCompare(nameB);
      case "nameDesc": return nameB.localeCompare(nameA);
      default: return 0;
    }
  });

  container.innerHTML = '';
  cards.forEach(card => container.appendChild(card));
}
window.onload = function () {
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

  displayReviews(productName); // refresh reviews
}
function displayReviews(productName) {
  const reviews = JSON.parse(localStorage.getItem("productReviews")) || {};
  const reviewList = reviews[productName] || [];

  const container = document.getElementById("reviewList");
  container.innerHTML = reviewList.length
    ? reviewList.map(r => `<li>⭐ ${r}</li>`).join("")
    : "<li>No reviews yet.</li>";
}
function updateCartWishlistCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("wishlistCount").textContent = wishlist.length;
}
function toggleReviewList() {
  const section = document.getElementById("reviewSection");
  section.classList.toggle("hidden");

  if (!section.classList.contains("hidden")) {
    displayReviews(currentProduct.name);
  }
}
