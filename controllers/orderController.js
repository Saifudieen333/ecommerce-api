const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { cartId, shippingAddress } = req.body;

  // 1. Find the cart
  const cart = await Cart.findById(cartId);
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Cart is empty or not found', 400));
  }

  // 2. Validate stock and calculate total price
  let totalPrice = 0;
  const orderItems = [];

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product);

    if (!product) {
      return next(new AppError(`Product not found`, 404));
    }

    if (product.stock < cartItem.quantity) {
      return next(new AppError(`Not enough stock for ${product.name}`, 400));
    }

    // Add to order items array
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity
    });

    // Calculate total
    totalPrice += product.price * cartItem.quantity;
  }

  // 3. Create the Order
  const order = await Order.create({
    items: orderItems,
    totalPrice,
    shippingAddress
  });

  // 4. Reduce stock for each product
  for (const cartItem of cart.items) {
    await Product.findByIdAndUpdate(cartItem.product, {
      $inc: { stock: -cartItem.quantity }
    });
  }

  // 5. Clear the cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    data: order
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('items.product', 'name');

  res.status(200).json({
    status: 'success',
    message: 'Orders retrieved successfully',
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Order retrieved successfully',
    data: order
  });
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Public (or Admin in real app)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Order status updated successfully',
    data: order
  });
});