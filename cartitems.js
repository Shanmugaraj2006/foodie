// Function to add item to cart, triggered by your UI button/event
function addItemToCart() {
  var itemName = localStorage.getItem('itemName'); // Should be set before calling this
  var itemPrice = localStorage.getItem('itemPrice');
  addToCart(itemName, itemPrice);
}

// Main function to handle cart logic
const addToCart = function(name, price){
  let cartItems = localStorage.getItem('cartItems');
  cartItems = cartItems ? JSON.parse(cartItems) : [];
  if(name == null || price == null) return;

  // Prevent duplicates
  const existingItem = cartItems.find(item => item.name === name);
  if (!existingItem) {
    cartItems.push({ name, price });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    calculateBill();
  } else {
    alert("Item already in the cart.");
    updateCartDisplay();
    calculateBill();
  }
};

// Display the cart in your table or container with class "items"
function updateCartDisplay() {
  const cartBody = document.querySelector(".items");
  cartBody.innerHTML = '';
  let cartItems = localStorage.getItem('cartItems');
  cartItems = cartItems ? JSON.parse(cartItems) : [];

  cartItems.forEach(item => {
    const cartRow = document.createElement("tr");
    const cartItemName = document.createElement("td");
    const cartItemPrice = document.createElement("td");
    cartItemName.innerText = item.name;
    cartItemPrice.innerText = item.price;
    cartItemPrice.classList.add("price"); // For CSS styling
    cartRow.appendChild(cartItemName);
    cartRow.appendChild(cartItemPrice);
    cartBody.appendChild(cartRow);
  });
}

// Display the total bill, assuming a container with id "bill"
function calculateBill() {
  let total = 0;
  const itemPrices = document.querySelectorAll(".price");
  for (let p of itemPrices) {
    if (p != null) {
      total += parseFloat(p.innerText.replace('₹','')); // Remove currency symbol if present
    }
  }
  document.getElementById("bill").innerText = "₹" + total.toFixed(2); // Display bill value
}

// Order button logic (assume a button with class "butt")
document.addEventListener('DOMContentLoaded', function () {
  updateCartDisplay();
  calculateBill();

  let orderBtn = document.querySelector(".butt");
  if(orderBtn){
    orderBtn.addEventListener("click", () => {
      let billValue = parseFloat(document.getElementById("bill").innerText.replace('₹', ''));
      if(billValue == 0 || isNaN(billValue)) {
        alert("Please add something in the cart to place the order");
      } else {
        alert("Order placed!");
        // Optionally: localStorage.removeItem('cartItems');
      }
    });
  }
});
