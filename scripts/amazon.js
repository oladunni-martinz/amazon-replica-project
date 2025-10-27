import {cart, addToCart} from "../data/cart.js";
import {products} from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
   <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
           ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
          $${formatCurrency(product.priceCents)}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" 
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

function updateCartQuantity () {
  let cartQuantity = 0;

  // sum quantities instead of overwriting
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const el = document.querySelector('.js-cart-quantity');
  if (el) el.innerHTML = cartQuantity;
}

// init count on load
updateCartQuantity();

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
    updateCartQuantity();
    // Show inline "Added" message for this product
    const productContainer = button.closest('.product-container');
    if (productContainer) {
      const addedEl = productContainer.querySelector('.added-to-cart');
      if (addedEl) {
        // fade in then fade out
        addedEl.style.transition = 'opacity 0.25s ease';
        addedEl.style.opacity = '1';
        setTimeout(() => {
          addedEl.style.opacity = '0';
        }, 1500);
      }

      // Get selected quantity (if present)
      const qtySelect = productContainer.querySelector('select');
      const quantity = qtySelect ? parseInt(qtySelect.value, 10) : 1;

      // Get product name from DOM or products array
      const productNameEl = productContainer.querySelector('.product-name');
      const productName = productNameEl ? productNameEl.textContent.trim() : '';

      // Show a temporary popup (toast)
      showAddedToCartPopup(productName, quantity);
    }
  });
});

function showAddedToCartPopup(productName, quantity) {
  const toast = document.createElement('div');
  toast.className = 'added-to-cart-popup';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const img = document.createElement('img');
  img.src = 'images/icons/checkmark.png';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  toast.appendChild(img);

  const text = document.createElement('div');
  text.className = 'added-to-cart-popup-text';
  const qtyText = quantity && quantity > 1 ? `${quantity} × ` : '';
  text.textContent = `Added ${qtyText}${productName} to cart`;
  toast.appendChild(text);

  document.body.appendChild(toast);

  // Force reflow so the transition will run
  // eslint-disable-next-line no-unused-expressions
  toast.offsetHeight;

  toast.classList.add('show');

  // Auto-remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    // remove from DOM after transition
    setTimeout(() => {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}
