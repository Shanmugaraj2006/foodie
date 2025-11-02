document.addEventListener('DOMContentLoaded', () => {
  loadCartFromLocalStorage();
  updateCartCount();

  document.getElementById('cart-items').addEventListener('click', (event) => {
    if (event.target.classList.contains('increase-quantity')) {
      updateQuantity(event.target, 1);
    } else if (event.target.classList.contains('decrease-quantity')) {
      updateQuantity(event.target, -1);
    } else if (event.target.classList.contains('remove-item')) {
      removeCartItem(event.target.dataset.itemId);
    }
  });

  document.getElementById('applyCouponButton').addEventListener('click', () => {
    const couponCodeInput = document.getElementById('inputCode').value.trim();
    if (!couponCodeInput) {
      alert('Please enter a Coupon Code.');
    }
    // Add coupon validation logic here if needed
  });

  document.getElementById('orderNowButton').addEventListener('click', () => {
    const total = updateTotal();
    if (total === 0) {
      alert('Your cart is empty!');
      return;
    }
    document.getElementById('myModal').style.display = 'block';
  });

  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('myModal').style.display = 'none';
  });

  window.onclick = (event) => {
    const modal = document.getElementById('myModal');
    if(event.target === modal) {
      modal.style.display = 'none';
    }
  };

  document.getElementById('donateBtn').addEventListener('click', () => {
    window.location.href = '../Html-files/donation-form.html';
  });
});

function loadCartFromLocalStorage() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = ''; // Clear previous

  if(cartItems.length === 0){
    cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
  } else {
    cartItems.forEach(item => {
      cartItemsContainer.appendChild(createCartItemElement(item));
    });
  }

  updateTotal();
}

function createCartItemElement(item) {
  const div = document.createElement('div');
  div.className = 'cart-item';
  div.setAttribute('data-product-id', item.id);
  div.setAttribute('data-product-price', item.unitPrice);
  div.setAttribute('data-product-name', item.name);
  div.setAttribute('data-product-image', item.image);

  div.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
    <div class="cart-item-details">
      <h5>${item.name}</h5>
      <p>Price: ₹${item.unitPrice}</p>
      <div class="quantity-controls">
        <button class="decrease-quantity${item.quantity <= 1 ? ' disable' : ''}">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increase-quantity">+</button>
      </div>
      <p class="price">₹${(item.unitPrice * item.quantity).toFixed(2)}</p>
      <button class="remove-item" data-item-id="${item.id}">Remove</button>
    </div>
  `;
  return div;
}

function updateQuantity(button, change) {
  const cartItemRow = button.closest('.cart-item');
  const quantityElement = cartItemRow.querySelector('.quantity');
  const priceElement = cartItemRow.querySelector('.price');
  const unitPrice = parseFloat(cartItemRow.getAttribute('data-product-price'));
  let newQuantity = parseInt(quantityElement.textContent) + change;

  if(newQuantity < 1) newQuantity = 1;

  quantityElement.textContent = newQuantity;
  priceElement.textContent = `₹${(unitPrice * newQuantity).toFixed(2)}`;

  const decreaseBtn = cartItemRow.querySelector(".decrease-quantity");
  if(newQuantity === 1) {
    decreaseBtn.classList.add("disable");
  } else {
    decreaseBtn.classList.remove("disable");
  }

  updateTotal();
  saveCartToLocalStorage();
}

function removeCartItem(itemId) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems = cartItems.filter(item => item.id !== itemId);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  loadCartFromLocalStorage();
  updateCartCount();
}

function updateTotal() {
  const cartItems = document.querySelectorAll('.cart-item');
  let total = 0;
  cartItems.forEach(item => {
    const unitPrice = parseFloat(item.getAttribute('data-product-price'));
    const quantity = parseInt(item.querySelector('.quantity').textContent);
    total += unitPrice * quantity;
  });
  document.getElementById('cart-total').textContent = total ? `Subtotal: ₹${total.toFixed(2)}` : '';
  handleEmptyCart(total);
  return total;
}

function saveCartToLocalStorage() {
  const cartItems = [];
  document.querySelectorAll('.cart-item').forEach(item => {
    cartItems.push({
      id: item.getAttribute('data-product-id'),
      name: item.getAttribute('data-product-name'),
      unitPrice: parseFloat(item.getAttribute('data-product-price')),
      quantity: parseInt(item.querySelector('.quantity').textContent),
      price: (parseFloat(item.getAttribute('data-product-price')) * parseInt(item.querySelector('.quantity').textContent)).toFixed(2),
      image: item.getAttribute('data-product-image'),
    });
  });
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function handleEmptyCart(total) {
  const emptyMessageElement = document.getElementById('empty-cart-message');
  if (total === 0) {
    emptyMessageElement.style.display = 'block';
    return true;
  } else {
    emptyMessageElement.style.display = 'none';
    return false;
  }
}
