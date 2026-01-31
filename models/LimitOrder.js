const mongoose = require('mongoose');

// Limit Order Schema
const LimitOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sector: {
        type: String,
// TODO: xoseu 