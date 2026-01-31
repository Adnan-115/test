// JWT Authentication Middleware
// Tutorial: https://www.youtube.com/watch?v=mbsmsi7l3r4 (JWT Auth Tutorial)
// Source: https://jwt.io/introduction
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Extract token from cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // 2. If no token, redirect to home
    if (!token) {
        return res.redirect('/');
    }

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find user in database
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }

        // 5. Ensure user is verified (Required since you implemented OTP)
        if (!req.user.isVerified) {
            // If they have an email, we can help them verify
            return res.redirect(`/auth/verify?email=${req.user.email}`);
        }

        // 6. Check if token was issued before the last logout
        if (req.user.lastLogout) {
            const lastLogoutTime = new Date(req.user.lastLogout).getTime() / 1000;
// WIP: Fixing bugs... 