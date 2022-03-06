import asyncHandler from 'express-async-handler';

import Product from '../models/productModel.js';

/**
 * @Desc    Fetch all products
 * @Route   GET /api/products
 * @Access  Public route
 */

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const term = req.query.term
    ? {
        name: {
          $regex: req.query.term,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...term });
  const products = await Product.find({ ...term })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

/**
 * @Desc    Fetch one product
 * @Route   GET /api/product
 * @Access  Public route
 */

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @Desc    DELETE one product
 * @Route   DELETE /api/product/:id
 * @Access  Private(Admin) route
 */

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @Desc    CREATE one product
 * @Route   POST /api/products
 * @Access  Private(Admin) route
 */

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    user: req.user._id,
    image: '/images/sample.png',
    description: 'Sample description',
    brand: 'Sample brand',
    category: 'Sample category',
    price: 0,
    countInStock: 0,
    rating: 0,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 * @Desc    UPDATE one product
 * @Route   PUT /api/products/:id
 * @Access  Private(Admin) route
 */

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
  }
});

/**
 * @Desc    CREATE new review
 * @Route   POST /api/products/:id/review
 * @Access  Private(Admin) route
 */

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (accumulator, currentItem) => currentItem.rating + accumulator,
        0
      ) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
  }
});

/**
 * @Desc    GET highest rated products
 * @Route   GET /api/products/high_rating
 * @Access  Public route
 */

const getHighRatedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(6);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getHighRatedProducts,
};
