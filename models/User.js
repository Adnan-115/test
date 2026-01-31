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
// TODO: f6qj2z 