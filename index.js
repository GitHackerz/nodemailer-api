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

function generateEmailHTML(title, description, dueDate) {
    return `
        <h1>New Task Added:</h1>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
    `;
}

app.get('/', (req, res) => {
    res.send('Welcome to the nodemailer API');
});

app.post('/api/send-email', (req, res) => {
    const { to, subject, body } = req.body;
    const { title, description, due } = body;
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html: generateEmailHTML(title, description, due)
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
