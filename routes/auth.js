// Authentication Routes
// Main Auth: https://youtu.be/6FOq4cUdH8k?si=CpxiMbVsN-prrvD8
// Social Login: https://youtube.com/playlist?list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x&si=bTYYFiyuN3Gyo8YH
// OTP Logic: https://youtu.be/dBl5seCbzYA?si=HCAEhols7s_XgdWK
// Source: https://expressjs.com/en/guide/routing.html
const express = require('express');
const router = express.Router();
const { register, login, logout, verifyOtp, verifyForm } = require('../controllers/authController');

const upload = require('../middleware/upload');

router.get('/register', (req, res) => res.render('register'));
router.post('/register', upload.single('avatar'), register);

router.get('/verify', verifyForm);
router.post('/verify', verifyOtp);

router.get('/login', (req, res) => res.render('login'));
router.post('/login', login);

router.get('/logout', logout);

const { completeProfileForm, completeProfile } = require('../controllers/authController');
router.get('/complete-profile', completeProfileForm);
router.post('/complete-profile', upload.single('avatar'), completeProfile);

const { updateAvatar, removeAvatar } = require('../controllers/authController');
// Avatar Management
const { protect } = require('../middleware/auth');

router.post('/update-avatar', protect, upload.single('avatar'), updateAvatar);
router.post('/remove-avatar', protect, removeAvatar);

// Google Auth
const passport = require('passport');
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            // Check for specific restriction message
            if (info && info.message && info.message.includes('@iut-dhaka.edu')) {
                req.flash('error', info.message);
                return res.redirect('/auth/register');
            }
            req.flash('error', 'Authentication failed.');
            return res.redirect('/auth/login');
        }
        // Check verification status
        // OTP Required for Social Logins as requested.
        if (!user.isVerified) {
            if (!user.otp || user.otpExpires < Date.now()) {
                user.otp = Math.floor(100000 + Math.random() * 900000).toString();
                user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
                await user.save();

                // Send Email
                const sendEmail = require('../utils/sendEmail');
                const emailTemplate = `
// TODO: z5ldg 