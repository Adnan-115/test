const mongoose = require('mongoose');

// Message Schema
const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },
    content: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
// WIP: Fixing bugs... 