// Object-oriented cart implementation
// Exports:
// - export class Cart
// - export const cart (array reference for backward compatibility)
// - export function addToCart(productId, qty)
// - export function removeFromCart(productId)
// - export function updateDeliveryOption(productId, deliveryOptionId)

const DEFAULT_SEED = [
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
];

export class Cart {
  constructor(storageKey = 'cart') {
    this.storageKey = storageKey;
    // keep a single array instance so module consumers that hold a reference
    // will see in-place updates (same behavior as previous module)
    this.items = [];
    this._initFromStorage();
  }

  _save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (err) {
      // ignore storage errors (e.g. private mode) to avoid breaking app
      // optionally could emit an event or callback here
    }
  }

  _initFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const parsed = raw ? JSON.parse(raw) : null;

      if (Array.isArray(parsed)) {
        this.items.push(...parsed);
      } else {
        this.items.push(...DEFAULT_SEED);
        this._save();
      }
    } catch (err) {
      // fallback to defaults if parse fails
      this.items.push(...DEFAULT_SEED);
      this._save();
    }
  }

  find(productId) {
    return this.items.find((i) => i.productId === productId);
  }

  add(productId, qty = 1) {
    const quantity = Number(qty) || 1;
    const matching = this.find(productId);
    if (matching) {
      matching.quantity = (matching.quantity || 0) + quantity;
    } else {
      this.items.push({ productId, quantity, deliveryOptionId: '1' });
    }
    this._save();
  }

  remove(productId) {
    const remaining = this.items.filter((i) => i.productId !== productId);
    // mutate in-place to preserve reference
    this.items.length = 0;
    this.items.push(...remaining);
    this._save();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const item = this.find(productId);
    if (!item) return;
    item.deliveryOptionId = deliveryOptionId;
    this._save();
  }

  clear() {
    this.items.length = 0;
    this._save();
  }
}

// single shared instance (convenience)
export const cartInstance = new Cart();

// Backwards-compatible `cart` array export (same array object as cartInstance.items)
export const cart = cartInstance.items;

// Backwards-compatible functions
export function addToCart(productId, qty = 1) {
  return cartInstance.add(productId, qty);
}

export function removeFromCart(productId) {
  return cartInstance.remove(productId);
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  return cartInstance.updateDeliveryOption(productId, deliveryOptionId);
}

export default cartInstance;
