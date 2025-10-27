export const orders = JSON.parse(localStorage.getItem('orders') || '[]');

export function addOrders(order) {
  // Add timestamp and generate order ID if not present
  const orderWithMetadata = {
    ...order,
    orderDate: new Date().toISOString(),
    orderId: order.orderId || generateOrderId(),
    orderStatus: 'Pending'
  };

  orders.unshift(orderWithMetadata);
  saveToStorage();
  return orderWithMetadata;
}

function generateOrderId() {
  return 'ord_' + Math.random().toString(36).substr(2, 9);
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrders() {
  return orders;
}

// Helper to get a single order by ID
export function getOrder(orderId) {
  return orders.find(order => order.orderId === orderId);
}

// Helper to update order status
export function updateOrderStatus(orderId, status) {
  const order = getOrder(orderId);
  if (order) {
    order.orderStatus = status;
    saveToStorage();
  }
}