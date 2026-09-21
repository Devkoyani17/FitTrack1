import Product from '../models/Product.js';

// @desc    Get all store products with search, filter, and sort
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sortBy,
      fitnessGoal
    } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Recommendation logic based on user fitness goal if requested
    if (fitnessGoal) {
      if (fitnessGoal === 'Muscle Gain') {
        query.category = { $in: ['Protein Supplements', 'Creatine', 'Pre-Workout'] };
      } else if (fitnessGoal === 'Weight Loss') {
        query.category = { $in: ['Healthy Foods', 'Protein Bars', 'Vitamins & Supplements'] };
      } else if (fitnessGoal === 'Endurance') {
        query.category = { $in: ['Recovery Products', 'Shakers & Bottles', 'Vitamins & Supplements'] };
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sortBy === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sortBy === 'popular') {
      sortOptions = { numReviews: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discountPrice,
      stock,
      images,
      ingredients,
      weight,
      flavor,
      tags
    } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price,
      discountPrice: discountPrice || 0,
      stock,
      images: images || [],
      ingredients: ingredients || '',
      weight: weight || '',
      flavor: flavor || '',
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Deactivate product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete (deactivate) so order history remains intact
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};
