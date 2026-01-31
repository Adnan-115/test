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
// TODO: qoespl 