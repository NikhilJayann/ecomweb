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

  // Hide the form
  document.getElementById("buyForm").style.display = "none";

  // Update thank you text
  document.getElementById("thankYouText").textContent = `Thank you for shopping with us, ${name}!`;

  // Show thank you screen
  document.getElementById("thankYouScreen").classList.remove("hidden");

  // Optional: Redirect to homepage after 5 seconds
  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
});

