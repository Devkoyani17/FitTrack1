import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Protein Supplements',
        'Vitamins & Supplements',
        'Pre-Workout',
        'Creatine',
        'Protein Bars',
        'Healthy Foods',
        'Gym Equipment',
        'Workout Accessories',
        'Shakers & Bottles',
        'Fitness Wear',
        'Yoga Products',
        'Recovery Products'
      ]
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Regular price is required'],
      min: 0
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: 0,
      default: 0
    },
    images: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    ingredients: {
      type: String,
      default: ''
    },
    weight: {
      type: String,
      default: ''
    },
    flavor: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', brand: 'text', category: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
