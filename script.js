self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-cache').then(function(cache) {
        return cache.addAll([
          '/Radiant-Medical-Center/',
          '/Radiant-Medical-Center/index.html',
          '/Radiant-Medical-Center/styles/styles1.css',
          '/Radiant-Medical-Center/styles/styles2.css',
          '/Radiant-Medical-Center/script.js',
          '/Radiant-Medical-Center/favicon_package/favicon_package/android-chrome-192x192.png',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registered with scope: ', registration.scope);
      }).catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
      });
    });
  }

  // Initialize medicines data
const medicines = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Medicine ${i + 1}`,
  price: parseFloat((Math.random() * 100).toFixed(2)),
}));

// Store medicines in localStorage (if not already stored)
if (!localStorage.getItem('medicines')) {
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

// Add to Cart Function
function addToCart(id) {
  const cart = JSON.parse(localStorage.getItem('cart')) || {}; // Get cart or initialize empty object
  const medicine = medicines.find(m => m.id === id); // Find medicine by ID

  if (medicine) {
      if (!cart[id]) {
          cart[id] = { ...medicine, quantity: 1 }; // Add new item to the cart
      } else {
          cart[id].quantity++; // Increment quantity if already in cart
      }
      localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
      alert(`${medicine.name} added to the cart!`);
  }
}

// Display Medicines on the Index Page
if (document.getElementById('medicineGrid')) {
  const medicineGrid = document.getElementById('medicineGrid');
  medicines.forEach(medicine => {
      const item = document.createElement('div');
      item.className = 'medicine-item';
      item.innerHTML = `
          <h3>${medicine.name}</h3>
          <p>Price: $${medicine.price.toFixed(2)}</p>
          <button onclick="addToCart(${medicine.id})">Add to Cart</button>
      `;
      medicineGrid.appendChild(item);
  });
}

// Render Cart Items on Cart Page
function renderCart() {
  if (!document.getElementById('cartItems')) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = ''; // Clear existing items
  let total = 0;

  Object.values(cart).forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
          <span>${item.name}</span>
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
          <span>Price: $${item.price.toFixed(2)}</span>
          <span id="total-${item.id}">Total: $${itemTotal.toFixed(2)}</span>
          <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItems.appendChild(div);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Update Quantity in Cart
function updateQuantity(id, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  if (cart[id]) {
      cart[id].quantity = Math.max(1, parseInt(quantity, 10)); // Ensure quantity is at least 1
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart(); // Re-render the cart
  }
}

// Remove Item from Cart
function removeFromCart(id) {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  delete cart[id]; // Remove item by ID
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart(); // Re-render the cart
}

// Payment Form Handling
if (document.getElementById('paymentForm')) {
  document.getElementById('paymentForm').addEventListener('submit', e => {
      e.preventDefault();
      alert('Payment Successful!');
      localStorage.removeItem('cart'); // Clear the cart after payment
      window.location.href = 'index.html'; // Redirect to the index page
  });
}

// Render Cart on Cart Page Load
if (document.getElementById('cartItems')) {
  renderCart();
}

// Add a Cart Button to Navigate to Cart Page
if (document.getElementById('cartButton')) {
  document.getElementById('cartButton').addEventListener('click', () => {
      window.location.href = 'cart.html';
  });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadCart() {
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = ""; // Clear the list
  let total = 0;

  cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <span>${item.name}</span>
          <span>$${item.price.toFixed(2)}</span>
          <span>
              <button onclick="changeQuantity(${index}, -1)">-</button>
              ${item.quantity}
              <button onclick="changeQuantity(${index}, 1)">+</button>
          </span>
          <span>$${itemTotal.toFixed(2)}</span>
          <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartList.appendChild(listItem);
  });

  document.getElementById("cartTotal").innerText = `$${total.toFixed(2)}`;
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function checkout() {
  if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
  }
  alert("Proceeding to checkout!");
  // Add checkout logic here
}




  // Load the cart when the page loads
  window.onload = loadCart;

  // Function to load the cart
  function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.getElementById('cartContainer');
    let totalPrice = 0;
    cartContainer.innerHTML = '';

    // Check if the cart is empty
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    // Display cart items
    cart.forEach(item => {
      let itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
        <p>${item.name} x ${item.quantity}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeFromCart('${item.name}')">Remove</button>
      `;
      cartContainer.appendChild(itemDiv);

      totalPrice += item.price * item.quantity;
    });

    // Display total price
    let totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<strong>Total: $${totalPrice.toFixed(2)}</strong>`;
    cartContainer.appendChild(totalDiv);
  }

  // Function to remove item from the cart
  function removeFromCart(itemName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();  // Reload the cart after removal
  }

  // Function to add an item to the cart
function addToCart(itemName, itemPrice) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let item = { name: itemName, price: itemPrice };

  // Check if the item already exists in the cart
  let existingItemIndex = cart.findIndex(i => i.name === itemName);
  if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;  // Update quantity if item already exists
  } else {
      item.quantity = 1;  // Set the initial quantity to 1 for a new item
      cart.push(item);
  }

  // Save the updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Optionally, alert the user that the item was added to the cart
  alert(itemName + " has been added to your cart!");
}

// Function to display items in the cart
function displayCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartContainer = document.getElementById('cart-items');
  let totalPrice = 0;
  cartContainer.innerHTML = '';

  // Display each item in the cart
  cart.forEach(item => {
      let itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
          <p>${item.name} x ${item.quantity}</p>
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
      `;
      cartContainer.appendChild(itemElement);

      totalPrice += item.price * item.quantity;
  });

  // Display total price
  let totalElement = document.getElementById('total-price');
  totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Initialize an empty cart if it's not already present in localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Function to add items to the cart
    function addToCart(itemName, itemPrice) {
        // Get the current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart'));

        // Create an object for the item to add
        let item = {
            name: itemName,
            price: itemPrice,
            quantity: 1
        };

        // Check if the item already exists in the cart
        let existingItemIndex = cart.findIndex(cartItem => cartItem.name === itemName);
        
        if (existingItemIndex !== -1) {
            // If the item exists, increase its quantity
            cart[existingItemIndex].quantity++;
        } else {
            // If the item doesn't exist, add it to the cart
            cart.push(item);
        }

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Optionally, alert the user that the item was added
        alert(`${itemName} added to cart!`);
    }

    // Load the cart when the page loads
window.onload = loadCart;

// Function to load the cart
function loadCart() {
  // Retrieve cart data from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartContainer = document.getElementById('cartContainer');
  let totalPrice = 0;
  
  // Clear any existing content in the cart container
  cartContainer.innerHTML = '';

  // Check if the cart is empty
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // Display cart items
  cart.forEach(item => {
    let itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.innerHTML = `
      <p>${item.name}</p>
      <label for="quantity-${item.name}">Quantity:</label>
      <input type="number" id="quantity-${item.name}" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}')">
      <p>Price: $<span id="price-${item.name}">${(item.price * item.quantity).toFixed(2)}</span></p>
      <button onclick="removeFromCart('${item.name}')">Remove</button>
    `;
    cartContainer.appendChild(itemDiv);

    // Calculate total price
    totalPrice += item.price * item.quantity;
  });

  // Display total price
  let totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<strong>Total: $<span id="totalPrice">${totalPrice.toFixed(2)}</span></strong>`;
  cartContainer.appendChild(totalDiv);
}

// Function to remove item from the cart
function removeFromCart(itemName) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.name !== itemName);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();  // Reload the cart after removal
}

// Function to update the quantity of an item and recalculate the price
function updateQuantity(itemName) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let item = cart.find(item => item.name === itemName);
  let newQuantity = document.getElementById(`quantity-${itemName}`).value;
  if (newQuantity < 1) newQuantity = 1;  // Ensure minimum quantity is 1
  item.quantity = parseInt(newQuantity);

  // Update the price display for the item
  let priceElement = document.getElementById(`price-${itemName}`);
  priceElement.innerText = (item.price * item.quantity).toFixed(2);

  // Update the total price
  updateTotalPrice();

  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the total price when quantity changes
function updateTotalPrice() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
}

// Debugging: Check what's in localStorage when the page loads
console.log("Cart from localStorage:", localStorage.getItem('cart'));

// Function to handle the payment form submission
document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    console.log("Form submitted"); // Debugging line to check if the form submission works

    // Get today's date and add 3-5 days for delivery (you can adjust this as needed)
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + Math.floor(Math.random() * 3) + 3)); // Random between 3 and 5 days

    // Format the delivery date (e.g., "December 8, 2024")
    const formattedDate = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Log the formatted date to check if it's being calculated correctly
    console.log("Delivery Date: " + formattedDate);

    // Hide the payment form
    document.querySelector('.payment-container').style.display = 'none';

    // Show the thank you message and delivery date
    const thankYouMessage = document.getElementById('thankYouMessage');
    const deliveryDateElement = document.getElementById('deliveryDate');
    
    // Make sure these elements exist
    if (thankYouMessage && deliveryDateElement) {
        document.getElementById('thankYouMessage').style.display = 'block';
        document.getElementById('deliveryDate').textContent = formattedDate;
    } else {
        console.log("Error: Could not find elements.");
    }
});document.getElementById('paymentForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way
  
  // Get the current date and calculate a delivery date
  const currentDate = new Date();
  const deliveryDate = new Date(currentDate);
  deliveryDate.setDate(currentDate.getDate() + 3); // Adding 3 days for delivery

  // Format the delivery date as a string (e.g., "December 7, 2024")
  const formattedDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Log to console for debugging
  console.log("Payment submitted successfully. Showing modal...");

  // Show the Thank You modal
  document.getElementById('thankYouModal').style.display = 'block';
  
  // Update the delivery date in the modal
  document.getElementById('deliveryDate').textContent = formattedDate;
});

// Close the modal when the user clicks the close button
document.getElementById('closeModal').addEventListener('click', function() {
  console.log("Closing modal...");
  document.getElementById('thankYouModal').style.display = 'none';
});

// Optionally, close the modal if clicked outside the modal content
window.addEventListener('click', function(event) {
  if (event.target === document.getElementById('thankYouModal')) {
    console.log("Clicked outside modal, closing...");
    document.getElementById('thankYouModal').style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    console.log('Form submitted. Preventing default behavior.');

    // Get the current date and calculate a delivery date
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 3); // Adding 3 days for delivery

    // Format the delivery date as a string (e.g., "December 7, 2024")
    const formattedDate = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Log the delivery date to confirm
    console.log("Delivery Date: ", formattedDate);

    // Show the Thank You modal
    document.getElementById('thankYouModal').style.display = 'block';
    
    // Update the delivery date in the modal
    document.getElementById('deliveryDate').textContent = formattedDate;
  });

  // Close the modal when the user clicks the close button
  document.getElementById('closeModal').addEventListener('click', function() {
    console.log("Closing modal...");
    document.getElementById('thankYouModal').style.display = 'none';
  });

  // Optionally, close the modal if clicked outside the modal content
  window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('thankYouModal')) {
      console.log("Clicked outside modal, closing...");
      document.getElementById('thankYouModal').style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.createElement('div'); // Create the overlay element
  overlay.classList.add('overlay');
  document.body.appendChild(overlay); // Add it to the document body

  hamburger.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active'); // Toggle the overlay when the sidebar is toggled
  });

  // Close the sidebar if overlay is clicked
  overlay.addEventListener('click', function() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });
});