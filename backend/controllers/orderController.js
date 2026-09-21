import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order & decrement stock
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.phone || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Verify stock availability & calculate verified backend totals
    let subtotal = 0;
    let totalDiscount = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);

      if (!dbProduct || !dbProduct.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name || item.product}" no longer exists or is inactive`
        });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${dbProduct.name}". Available: ${dbProduct.stock}`
        });
      }

      const finalUnitPrice = dbProduct.discountPrice > 0 ? dbProduct.discountPrice : dbProduct.price;
      subtotal += dbProduct.price * item.quantity;
      if (dbProduct.discountPrice > 0) {
        totalDiscount += (dbProduct.price - dbProduct.discountPrice) * item.quantity;
      }

      verifiedOrderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        quantity: item.quantity,
        price: finalUnitPrice,
        image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : ''
      });
    }

    const shippingPrice = subtotal > 1500 ? 0 : 99; // Free shipping over 1500
    const totalPrice = (subtotal - totalDiscount) + shippingPrice;

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      subtotal,
      discount: totalDiscount,
      shippingPrice,
      totalPrice
    });

    // Safely decrement stock for each ordered product
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's shopping cart after checkout
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // User privacy check: only owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel user order (if status is Pending or Confirmed)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}`
      });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Restock product inventory
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.paymentStatus = 'Paid';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
