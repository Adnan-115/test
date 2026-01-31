// Multer & Cloudinary Configuration
// Source: https://www.npmjs.com/package/multer-storage-cloudinary
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
// Source: https://cloudinary.com/documentation/node_integration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// TODO: aa4c 