import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import {
  sendOrderPaymentEmail,
  sendOrderShippedEmail,
  sendOrderDeliveryEmail,
} from '../emails/account.js';

/**
 * @Desc    Create new order
 * @Route   POST /api/orders
 * @Access  Private route
 */

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      trackingNumber: 'SAMPLETRACKING',
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

/**
 * @Desc    GET a single order w/ Id
 * @Route   GET /api/orders/:id
 * @Access  Private route
 */

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @Desc    Update order to paid
 * @Route   PUT /api/orders/:id/pay
 * @Access  Private route
 */

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    sendOrderPaymentEmail(
      order._id.toString(),
      order.shippingAddress.address,
      order.shippingAddress.city,
      order.shippingAddress.postalCode,
      order.shippingAddress.country,
      order.user.email,
      order.user.name,
      order.paymentMethod,
      order.totalPrice
    );

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @Desc    Update order to delivered
 * @Route   PUT /api/orders/:id/delivery
 * @Access  Private(Admin) route
 */

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    sendOrderDeliveryEmail(
      order._id.toString(),
      order.shippingAddress.address,
      order.shippingAddress.city,
      order.shippingAddress.postalCode,
      order.shippingAddress.country,
      order.user.email,
      order.trackingNumber,
      order.user.name,
      order.totalPrice
    );
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @Desc    Update order to shipped
 * @Route   PUT /api/orders/:id/shipped
 * @Access  Private(Admin) route
 */

const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    sendOrderShippedEmail(
      order._id.toString(),
      order.shippingAddress.address,
      order.shippingAddress.city,
      order.shippingAddress.postalCode,
      order.shippingAddress.country,
      order.user.email,
      order.trackingNumber,
      order.user.name,
      order.totalPrice
    );
    order.isShipped = true;
    order.shippedAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @Desc    Update order tracking
 * @Route   PUT /api/orders/:id/tracking
 * @Access  Private(Admin) route
 */

const updateOrderToTracking = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.trackingNumber = req.body.trackingNumber || order.trackingNumber;
    const updatedOrder = await order.save();
    res.json({
      _id: updatedOrder._id,
      user: req.user._id,
      orderItems: updatedOrder.orderItems,
      shippingAddress: updatedOrder.shippingAddress,
      paymentMethod: updatedOrder.paymentMethod,
      itemsPrice: updatedOrder.itemsPrice,
      taxPrice: updatedOrder.taxPrice,
      trackingNumber: updatedOrder.trackingNumber,
      shippingPrice: updatedOrder.shippingPrice,
      totalPrice: updatedOrder.totalPrice,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @Desc    GET logged in user orders
 * @Route   GET /api/orders/myorders
 * @Access  Private route
 */

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

/**
 * @Desc    GET all orders
 * @Route   GET /api/orders
 * @Access  Private(Admin) route
 */

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToTracking,
  updateOrderToDelivered,
  updateOrderToShipped,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
};
