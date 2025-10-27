import {cart} from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import {formatCurrency} from "../utils/money.js";
import {addOrders} from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let totalQuantity = 0;

    // Implementation of payment summary rendering
  cart.forEach((cartItem) => {
    // Render each cart item in the payment summary
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    totalQuantity += cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

 const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
<div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalQuantity}):</div>
      <div class="payment-summary-money">
      $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
      $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
      $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
      $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
      $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
`;

document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

document.querySelector('.js-place-order').addEventListener('click', async () => {
  try {
    const button = document.querySelector('.js-place-order');
    button.disabled = true;
    button.innerHTML = 'Placing order...';

    // Create order with full product details
    const orderItems = cart.map(cartItem => {
      const product = getProduct(cartItem.productId);
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      return {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        deliveryOptionId: cartItem.deliveryOptionId,
        // Include product details needed for display
        name: product.name,
        image: product.image,
        priceCents: product.priceCents,
        deliveryOptionName: deliveryOption.name,
        deliveryDays: deliveryOption.deliveryDays
      };
    });

    const orderData = {
      cart: orderItems,
      totalQuantity,
      productPriceCents,
      shippingPriceCents,
      taxCents,
      totalCents
    };

    const response = await fetch('https://supersimplebackend.dev/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const orderResponse = await response.json();
    
    // Add full order details to local storage
    const savedOrder = addOrders({
      ...orderData,
      orderId: orderResponse.orderId || undefined,
      orderDate: new Date().toISOString(),
      orderStatus: 'Order Placed'
    });

    // Clear the cart after successful order
    cart.length = 0;
    localStorage.setItem('cart', JSON.stringify([]));

    // Redirect to orders page using relative path
    window.location.href = 'orders.html';
  } catch (error) {
    console.error('Error placing order:', error);
    alert('There was a problem placing your order. Please try again.');
    button.disabled = false;
    button.innerHTML = 'Place your order';
  }
});
} 




