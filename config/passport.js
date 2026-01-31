// Passport Strategies
// Tutorial: https://www.youtube.com/watch?v=-RCnNyD0L-s (Passport.js Login System)
// Source: https://www.passportjs.org/docs/
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    // Serialize / Deserialize
    // Source: https://www.passportjs.org/docs/configure/
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    /*
     * Google Strategy
     * Source: https://www.passportjs.org/packages/passport-google-oauth20/
     * Logic: Verifies email domain (@iut-dhaka.edu) before creation.
     */
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            // Validation: Check if email is from iut-dhaka.edu
            const email = profile.emails[0].value;
            if (!email.endsWith('@iut-dhaka.edu')) {
                return done(null, false, { message: 'Access Denied: Please use your @iut-dhaka.edu email.' });
            }

            // Extract Student ID if present (9 digits)
            const idMatch = email.match(/\d{9}/);
            const studentId = idMatch ? idMatch[0] : undefined;

            const newUser = {
                googleId: profile.id,
                name: profile.displayName,
// TODO: x3alql 