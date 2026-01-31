// Chat Controller
// Tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k (Realtime Chat with Socket.io)
// Source: https://mongoosejs.com/docs/api/aggregate.html
const Message = require('../models/Message');
const User = require('../models/User');

/*
 * Get chat UI or start new chat
 */
exports.startChat = async (req, res) => {
    try {
        const otherUser = await User.findById(req.params.userId);
        if (!otherUser) return res.redirect('/products');

        let chatPartnerName = otherUser.name;
        let isAnonymousContext = false;
        let productId = req.query.productId || null;

        // Check for anonymous context via productId
        if (productId) {
            const Product = require('../models/Product');
            const product = await Product.findById(productId);
            // If the chat is ABOUT this product, check if it's anonymous
            if (product && product.isAnonymous && product.user.toString() === otherUser._id.toString()) {
                chatPartnerName = "Anonymous Seller";
                isAnonymousContext = true;
            }
        }

        // Fetch valid previous messages
        // Filter by product if provided, otherwise fetch generic chats OR all chats between them?
        // User wants "on chat cards there will be details about ... the product"
        // So we strictly separate chats by product.

        let query = {
            $or: [
                { sender: req.user.id, receiver: otherUser._id },
                { sender: otherUser._id, receiver: req.user.id }
            ]
        };

        if (productId) {
            query.product = productId;
        }

        // Hide messages deleted by user
        query.hiddenFor = { $ne: req.user.id };

        const messages = await Message.find(query).sort({ timestamp: 1 });

        // Mark messages as read
        await Message.updateMany(
            { sender: otherUser._id, receiver: req.user.id, read: false }, // Only from them to me
            { read: true }
        );

        // Update local unreadCount
        const newUnreadCount = await Message.countDocuments({
            receiver: req.user._id,
            read: false,
            hiddenFor: { $ne: req.user.id }
        });
        res.locals.unreadCount = newUnreadCount;

        res.render('chat/room', {
            title: 'Chat with ' + chatPartnerName,
            user: req.user,
            otherUser: { ...otherUser.toObject(), name: chatPartnerName }, // Override name for view
            messages,
            isAnonymousContext,
            productId // Pass to view for socket
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

// TODO: hl0bn2 