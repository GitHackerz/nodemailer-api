const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the nodemailer API');
});

app.post('/api/send-email', (req, res) => {
    const {to, subject, body} = req.body;
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.send('Email sent successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
