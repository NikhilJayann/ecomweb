window.onload = function () {
  const product = JSON.parse(localStorage.getItem("buyNowProduct"));
  if (product) {
    document.getElementById("buyProductImg").src = product.image;
    document.getElementById("buyProductTitle").textContent = product.name;
    document.getElementById("buyProductPrice").textContent = product.price;
    document.getElementById("buyProductSize").textContent = product.size || "M";
  }
};

// Optional: Handle form submission
document.getElementById("buyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const address = document.getElementById("address").value.trim();
  const pincode = document.getElementById("pincode").value.trim();

  if (!/^\d{6}$/.test(pincode)) {
    alert("Please enter a valid 6-digit pincode.");
    return;
  }

  alert("✅ Order placed successfully!\n\nThank you for shopping with us, " + name + "!");
  window.location.href = "index.html";
});
