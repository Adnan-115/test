// Product Controller
// Source: https://mongoosejs.com/docs/queries.html
const Product = require('../models/Product');
const LimitOrder = require('../models/LimitOrder');
const path = require('path');
const fs = require('fs');

/*
 * Get all products
 * Logic: Supports filtering by Sector, Max Price, and availability.
 */
exports.getProducts = async (req, res) => {
    try {
        let query = { status: 'Available' };
        if (req.user) {
            query.user = { $ne: req.user.id };
        }

        // Filter by Sector (Category)
        if (req.query.sector) {
            query.category = { $regex: new RegExp('^' + req.query.sector + '$', 'i') };
        }

        // Filter by Max Price
        if (req.query.maxPrice) {
            query.price = { $lte: req.query.maxPrice };
        }
        const products = await Product.find(query).populate('user', 'name avatar studentId');
        res.render('products/index', {
            title: 'Marketplace',
            products,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
};

/*
 * Get single product
 */
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'name email avatar studentId');

        if (!product) {
            return res.render('error', { error: 'Product not found' });
        }

        res.render('products/details', {
            title: product.title,
            product,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        res.status(404).render('error', { error: 'Product not found' });
    }
};

/*
 * Show Create Product Form
 */
exports.createProductForm = (req, res) => {
    res.render('products/create', { title: 'Sell Item', user: req.user });
};

/*
 * Create new product
 * Logic: Saves product and triggers matching engine for Limit Orders.
 */
exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, category, isAnonymous } = req.body;

        // Handle images
        let images = [];
        if (req.files) {
            req.files.forEach(file => {
                images.push(file.path); // Cloudinary URL
            });
        }

        await Product.create({
            title,
            description,
            price,
            category,
            images,
            isAnonymous: isAnonymous === 'on', // Checkbox sends 'on' if checked
            user: req.user.id
        });

        // ---------------------------------------------------------
        // LIMIT ORDER MATCHING PROTOCOL
        // ---------------------------------------------------------
        // Find active orders for this sector with maxPrice >= new product price
        const matchingOrders = await LimitOrder.find({
            sector: category,
            maxPrice: { $gte: price },
            status: 'ACTIVE',
            user: { $ne: req.user.id } // Prevent self-matching (Wash Trading)
        });

        if (matchingOrders.length > 0) {
            // For MVP: Mark them as 'FILLED' to simulate execution
            for (const order of matchingOrders) {
                order.status = 'FILLED';
                await order.save();
            }
        }
        // ---------------------------------------------------------

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('products/create', {
            title: 'Sell Item',
            user: req.user,
            error: 'Error creating product. Please try again.',
            formData: req.body // to repopulate form
        });
    }
};

/*
 * Delete product
 */
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
// WIP: Fixing bugs... 