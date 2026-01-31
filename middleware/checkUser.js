// Check User Middleware (for public pages)
// Tutorial: https://www.youtube.com/watch?v=SnoAwLP1a-0 (Node.js Auth Logic)
// Source: https://jwt.io/introduction
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check current user (for public pages)
exports.checkUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
// TODO: cxu69 