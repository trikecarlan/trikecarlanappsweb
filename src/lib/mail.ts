import nodemailer from 'nodemailer';

interface MailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}

export async function sendMail({ to, subject, text, html }: MailOptions): Promise<void> {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'carlantrike@gmail.com',
            pass: 'lgan umzn uqdd fozz',
        },
    });

    let mailOptions = {
        from: { name: "trikecarlan", address: 'carlantrike@gmail.com' },
        to: 'aaronanablon6@gmail.com',
        subject: 'Hello from Node.js',
        text: 'Hello from Node.js using Nodemailer',
        html: '<h1>Hello from Node.js</h1>',
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error:', error);
    }
}
