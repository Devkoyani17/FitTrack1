import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get admin store dashboard statistics
// @route   GET /api/admin/store/stats
// @access  Private/Admin
export const getAdminStoreStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Calculate total revenue from delivered/confirmed orders
    const salesData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Low stock products alert
    const lowStockProducts = await Product.find({ stock: { $lte: 10 }, isActive: true })
      .select('name brand category stock price')
      .limit(10);

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalSales,
        totalCustomers,
        lowStockProducts,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
