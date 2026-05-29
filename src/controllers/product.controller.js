const Product = require('../model/product.model');
const mongoose = require('mongoose');

// GET /products
// Fetch all products with optional category filtering
const getAllProducts = async (req, res) => {
  try {
    const filter = {};
    
    // Category filtering support (case-insensitive conversion to match model lowercase configuration)
    if (req.query.category) {
      filter.category = req.query.category.trim().toLowerCase();
    }

    const products = await Product.find(filter);
    
    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products due to a database/server error"
    });
  }
};

// GET /products/:id
// Retrieve a single product by its unique database ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error retrieving product details"
    });
  }
};

// POST /products
// Create a new product. Images are processed via multer and stored as filenames.
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Parse uploaded files from multer array middleware
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      images
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    
    // Check for mongoose validation error specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error creating the product"
    });
  }
};

// PUT /products/:id
// Update an existing product's fields by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format"
      });
    }

    // Capture potential file updates if any (optional for updates)
    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.filename);
    }

    // Run validator on update to ensure fields like price/name remain valid if updated
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found to update"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error in updateProduct:", error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error on Update",
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error updating the product"
    });
  }
};

// DELETE /products/:id
// Delete a product from the database by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format"
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found to delete"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error deleting the product"
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
