// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const shopifyAuth = require('../middleware/shopifyAuth');

// Route to add an image to a product (e.g., POST /api/products/:id/images)
router.post('/:id/images', shopifyAuth, productController.addProductImage);

// Route to get all images for a product (e.g., GET /api/products/:id/images)
router.get('/:id/images', shopifyAuth, productController.getProductImages);

module.exports = router;
