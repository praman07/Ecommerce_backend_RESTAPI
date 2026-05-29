const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateProduct } = require('../middleware/product.validator');
const upload = require('../middleware/upload.middleware');

// Public routes
// GET /products - Retrieve all products (supports category filtering)
router.get('/products', getAllProducts);

// GET /products/:id - Retrieve a specific product by ID
router.get('/products/:id', getProductById);

// Protected routes (Authentication Required)
// POST /products - Create a new product (handles up to 5 images upload and validates input fields)
router.post('/products', authMiddleware, upload.array('images', 5), validateProduct, createProduct);

// PUT /products/:id - Update product details by ID (optionally accepts up to 5 updated images and validates inputs)
router.put('/products/:id', authMiddleware, upload.array('images', 5), validateProduct, updateProduct);

// DELETE /products/:id - Delete a product by ID
router.delete('/products/:id', authMiddleware, deleteProduct);

module.exports = router;
