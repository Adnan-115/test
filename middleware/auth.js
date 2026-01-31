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
// TODO: f1xikd 