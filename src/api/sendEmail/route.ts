import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export default async function POST(req: NextApiRequest, res: NextResponse) {
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;

        // Create a Nodemailer transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.example.com', // Replace with your SMTP server host
            port: 587, // Replace with the appropriate port
            secure: false, // True for 465, false for other ports
            auth: {
                user: "carlantrike@gmail.com",
                pass: "trikeCarlan2024",
            },
        });

        try {
            // Send the email
            await transporter.sendMail({
                from: '"Your Name" <your-email@example.com>', // Sender address
                to, // List of recipients
                subject, // Subject line
                text, // Plain text body
            });

            return NextResponse.json({ message: 'Email sent successfully' })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Error sending email' });
        }
    } else {
        return NextResponse.json({ message: 'Method not allowed' });
    }
}
