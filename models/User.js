const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@iut-dhaka\.edu$/,
            'Please use a valid @iut-dhaka.edu email address'
        ]
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true
    },
    contactNumber: {
        type: String
    },
    password: {
        type: String,
        select: false // Do not return password by default
    },
    googleId: String,
    githubId: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dzt8xvzhp/image/upload/v1738308000/default-avatar.png'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
// WIP: Fixing bugs... 