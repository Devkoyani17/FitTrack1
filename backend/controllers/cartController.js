import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name brand price discountPrice stock images category isActive'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out inactive products if any
    cart.items = cart.items.filter(item => item.product && item.product.isActive);

    // Calculate subtotal, discount, total
    let subtotal = 0;
    let totalDiscount = 0;

    cart.items.forEach(item => {
      const p = item.product;
      const effectivePrice = p.discountPrice > 0 ? p.discountPrice : p.price;
      subtotal += p.price * item.quantity;
      if (p.discountPrice > 0) {
        totalDiscount += (p.price - p.discountPrice) * item.quantity;
      }
    });

    const totalPrice = subtotal - totalDiscount;

    res.json({
      success: true,
      summary: {
        itemCount: cart.items.reduce((acc, i) => acc + i.quantity, 0),
        subtotal,
        discount: totalDiscount,
        totalPrice
      },
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity: qty, price: product.discountPrice || product.price }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        const newQty = cart.items[itemIndex].quantity + qty;
        if (product.stock < newQty) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more. Max stock available: ${product.stock}`
          });
        }
        cart.items[itemIndex].quantity = newQty;
        cart.items[itemIndex].price = product.discountPrice || product.price;
      } else {
        cart.items.push({
          product: productId,
          quantity: qty,
          price: product.discountPrice || product.price
        });
      }
      await cart.save();
    }

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Product added to cart',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const newQty = Number(quantity);

    if (newQty <= 0) {
      return removeFromCart(req, res, next);
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < newQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = newQty;
      await cart.save();
    } else {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart'
      });
    }

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};
