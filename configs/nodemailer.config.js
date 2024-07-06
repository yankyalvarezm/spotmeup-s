const nodemailer = require('nodemailer');

// Configure your SMTP server for sending emails
const smtpConfig = {
  host: process.env.SMTPHOST,
  port: process.env.SMTPPORT, // Use the appropriate port
  secure: process.env.SMTP_SECURE, // Set to true if using SSL/TLS
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS,
  },
};

// Create the transporter
const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;