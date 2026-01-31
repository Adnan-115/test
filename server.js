// Express App Setup
// Tutorial: https://www.youtube.com/watch?v=L72fhGm1tfE (Express.js Crash Course)
// Source: https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');

// Load env vars
dotenv.config();

// Connect to DB
// Source: https://mongoosejs.com/docs/connections.html
const connectDB = require('./config/db');
connectDB();

// Passport Config
// Source: https://www.passportjs.org/docs/
require('./config/passport')(passport);

const app = express();
const server = http.createServer(app);

// Socket.io Setup
// Tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k (Socket.io Realtime Chat)
// Source: https://socket.io/get-started/chat/
const io = socketIo(server);

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const flash = require('connect-flash');

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Static Files Serving
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global variables middleware for views
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Custom Middleware for User Checking
const { checkUser } = require('./middleware/checkUser');
app.use(checkUser);

// Custom Middleware for Notifications
const notification = require('./middleware/notification');
app.use(notification);

// Route Definitions
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/chat', require('./routes/chat'));

// Home Route
app.get('/', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/dashboard');
    }
    res.render('index', { title: 'IUT Marketplace', user: req.user });
});

/**
 * Dashboard Route
 * Logic: Fetches user products and limit orders.
 * Source: Self-authored implementation of dashboard logic.
 */
const { protect } = require('./middleware/auth');
const preventCache = require('./middleware/preventCache');
app.get('/dashboard', protect, preventCache, async (req, res) => {
    const Product = require('./models/Product');
    const LimitOrder = require('./models/LimitOrder');

    // Fetch products owned by the user
    const myProducts = await Product.find({ user: req.user.id });

    // Fetch active orders
    const myOrders = await LimitOrder.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Matching Engine Simulation (Self-authored logic)
    const ordersWithMatches = await Promise.all(myOrders.map(async (order) => {
        const orderObj = order.toObject();
        // Find products matching the limit order criteria
        const matches = await Product.find({
            category: { $regex: new RegExp('^' + order.sector + '$', 'i') },
            price: { $lte: order.maxPrice },
            user: { $ne: req.user.id },
        });
        orderObj.matches = matches;
        return orderObj;
    }));

// WIP: Fixing bugs... 