const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;