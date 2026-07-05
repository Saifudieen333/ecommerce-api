const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Helper function to calculate total price
const calculateTotalPrice = (cart) => {
  cart.totalPrice = cart.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
};

// @desc    Add item to cart
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { cartId, productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check stock
  if (product.stock < quantity) {
    return next(new AppError('Not enough stock available', 400));
  }

  // Find or create cart
  let cart = await Cart.findById(cartId);
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }

  // Check if item already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity: quantity,
      price: product.price
    });
  }

  calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item added to cart',
    data: cart
  });
});

// @desc    Update item quantity
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { cartId } = req.body;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  cart.items[itemIndex].quantity = quantity;
  calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart item updated',
    data: cart
  });
});

// @desc    Remove item from cart
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { cartId } = req.query;
  const { productId } = req.params;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: cart
  });
});

// @desc    Get cart
exports.getCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.query;

  const cart = await Cart.findById(cartId).populate('items.product', 'name price images');

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Cart retrieved successfully',
    data: cart
  });
});

// @desc    Clear cart
exports.clearCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.query;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully',
    data: cart
  });
});