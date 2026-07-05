const express = require('express');
const router = express.Router();
const {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
  clearCart
} = require('../controllers/cartController');

// Add item
router.post('/items', addToCart);

// Update or Remove specific item
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);

// View or Clear the whole cart
router.get('/', getCart);
router.delete('/', clearCart);

module.exports = router;