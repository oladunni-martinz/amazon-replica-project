import { orders } from '../data/orders.js';
import { formatCurrency } from './utils/money.js';
import { addToCart } from '../data/cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function renderOrders() {
  const ordersGrid = document.querySelector('.js-orders-grid');
  if (!ordersGrid) return;

  // Clear existing content
  ordersGrid.innerHTML = '';

  if (!orders.length) {
    ordersGrid.innerHTML = `
      <div class="no-orders">
        <p>No orders found.</p>
        <a href="amazon.html" class="button-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.orderDate) - new Date(a.orderDate)
  );

  sortedOrders.forEach(order => {
    const orderDate = new Date(order.orderDate);
    const dateString = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const orderHtml = `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dateString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.orderId || 'Processing'}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${order.cart.map(item => {
            const deliveryDate = dayjs().add(item.deliveryDays || 7, 'days');
            const deliveryDateString = deliveryDate.format('dddd, MMMM D');

            return `
              <div class="product-image-container">
                <img src="${item.image}">
              </div>

              <div class="product-details">
                <div class="product-name">
                  ${item.name}
                </div>
                <div class="product-delivery-date">
                  Arriving on: ${deliveryDateString}
                </div>
                <div class="product-quantity">
                  Quantity: ${item.quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again" data-product-id="${item.productId}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png">
                  <span class="buy-again-message">Buy it again</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="tracking.html?orderId=${order.orderId}&productId=${item.productId}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    ordersGrid.innerHTML += orderHtml;
  });

  // Add event listeners for buy again buttons
  document.querySelectorAll('.js-buy-again').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId, 1);
      
      // Show feedback
      const message = document.createElement('div');
      message.textContent = 'Added to cart';
      message.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #2ecc71; color: white; padding: 10px 20px; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.remove();
      }, 2000);
    });
  });
}

// Initialize
renderOrders();

// Optionally refresh orders periodically or on visibility change
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    renderOrders();
  }
});