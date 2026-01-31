// Notification Middleware
// Source: https://expressjs.com/en/guide/writing-middleware.html
const Message = require('../models/Message');

module.exports = async (req, res, next) => {
    if (req.user) {
        try {
            const unreadCount = await Message.countDocuments({
// TODO: 2d87ws 