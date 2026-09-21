import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Add product review (Verified buyers only)
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Verify user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      orderStatus: { $in: ['Delivered', 'Shipped', 'Processing', 'Confirmed'] }
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
    } else {
      await Review.create({
        user: req.user._id,
        product: productId,
        order: hasPurchased ? hasPurchased._id : null,
        rating: Number(rating),
        comment
      });
    }

    // Update product rating and review count
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    product.rating = parseFloat(avgRating.toFixed(1));
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
