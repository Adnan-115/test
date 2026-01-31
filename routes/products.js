// Product Routes
// Source: https://expressjs.com/en/guide/routing.html
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProductForm,
    createProduct,
    deleteProduct,
    createLimitOrder,
    deleteLimitOrder
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);

// Protected routes
router.get('/create', protect, createProductForm);
router.post('/', protect, (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            console.error('[UPLOAD ERROR]', err);
            return res.render('products/create', {
                title: 'Sell Item',
                user: req.user,
                error: 'Image Upload Failed: ' + err.message,
                formData: req.body
// WIP: Fixing bugs... 