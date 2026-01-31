// Express App Setup
// Tutorial: https://www.youtube.com/watch?v=L72fhGm1tfE (Express.js Crash Course)
// Source: https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');

// Load env vars
dotenv.config();

// Connect to DB
// Source: https://mongoosejs.com/docs/connections.html
const connectDB = require('./config/db');
connectDB();

// Passport Config
// Source: https://www.passportjs.org/docs/
require('./config/passport')(passport);

const app = express();
const server = http.createServer(app);

// Socket.io Setup
// Tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k (Socket.io Realtime Chat)
// Source: https://socket.io/get-started/chat/
const io = socketIo(server);

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const flash = require('connect-flash');

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Static Files Serving
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global variables middleware for views
app.use((req, res, next) => {
// TODO: 1j314s 