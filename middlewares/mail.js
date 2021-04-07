const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const dotenv = require('dotenv');

dotenv.config();

// api and domain provided by mailgun
const auth = {
    auth: {
        api_key: process.env.API_KEY,
        domain: 'sandboxc6297caa1a6a472b8723fdfd8d2b4782.mailgun.org',
    },
};

const transporter = nodemailer.createTransport(mailGun(auth));

// to send mail to the recepient
const sendMail = (subject, email, message, cb) => {
    const mailOptions = {
        from: email,
        to: 'alphavio16@gmail.com', // email of verified recipient
        subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) cb(err, null);
        else cb(null, data);
    });
};

module.exports = sendMail;
