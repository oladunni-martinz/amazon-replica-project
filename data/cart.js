export let cart = [];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// initialize cart from storage (safe parse) or seed defaults
try {
  const raw = localStorage.getItem('cart');
  const parsed = raw ? JSON.parse(raw) : null;

  if (Array.isArray(parsed)) {
    cart.push(...parsed);
  } else {
    cart.push(
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      },
      {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }
    );
    saveToStorage();
  }
} catch (err) {
  // fallback to defaults if parse fails
  cart.push(
    {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    },
    {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }
  );
  saveToStorage();
}

export function addToCart(productId, qty = 1) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    // ensure numeric addition
    matchingItem.quantity = (matchingItem.quantity || 0) + Number(qty);
  } else {
    cart.push({
      productId: productId,
      quantity: Number(qty) || 1,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  // mutate array in-place so module consumers holding a reference keep it up-to-date
  const remaining = cart.filter((cartItem) => cartItem.productId !== productId);

  // clear original array and push remaining items
  cart.length = 0;
  cart.push(...remaining);

  saveToStorage();
}

  export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }