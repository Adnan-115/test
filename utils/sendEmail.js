// Send Email Utility
// Tutorial: https://www.youtube.com/watch?v=nF9g1825mwk (Nodemailer Tutorial)
// Source: https://nodemailer.com/about/
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
// TODO: e2nq3m 