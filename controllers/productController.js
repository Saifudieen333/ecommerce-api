const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Get all products (with filtering)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;
  let query = {};

  // 1. Filter by Category
  if (category) {
    query.category = category;
  }

  // 2. Filter by Price Range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice); // Greater than or equal
    if (maxPrice) query.price.$lte = Number(maxPrice); // Less than or equal
  }

  // 3. Filter by InStock
  if (inStock === 'true') {
    query.inStock = true;
  }

  // 4. Search by Name (Case-insensitive)
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(query);

  res.status(200).json({
    status: 'success',
    message: 'Products retrieved successfully',
    count: products.length,
    data: products
  });
});

// @desc    Get single product by ID (with populate)
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category", "name description");

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product retrieved successfully',
    data: product
  });
});

// @desc    Create new product (validates category)
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Validate that the category exists before creating the product
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new AppError('Category not found', 404));
    }
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: product
  });
});

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  // Optional: You can add category validation here too if you want
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new AppError('Category not found', 404));
    }
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: product
  });
});

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
    data: {}
  });
});