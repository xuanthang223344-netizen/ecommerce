// cart.js - Quản lý giỏ hàng bằng localStorage

const CART_KEY = 'cart';

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

// Thêm sản phẩm vào giỏ hàng
// product: { product: id, name, price, image, qty }
function addToCart(product, qty = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.product === product.product);

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      product: product.product,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }

  saveCart(cart);
}

function updateCartItemQty(productId, qty) {
  let cart = getCart();
  const item = cart.find(i => i.product === productId);
  if (item) {
    if (qty <= 0) {
      cart = cart.filter(i => i.product !== productId);
    } else {
      item.qty = qty;
    }
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.product !== productId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('d-none');
    } else {
      badge.classList.add('d-none');
    }
  }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
