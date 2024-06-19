import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function POST(req: any, res: NextApiResponse) {
    const { from, to, subject, text, html }: MailOptions = await req.json()
   
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'carlantrike@gmail.com',
            pass: 'lgan umzn uqdd fozz',
        },
    });

    const mailData = {
        from,
        to,
        subject,
        text,
        html
    };

    try {
        let info = await transporter.sendMail(mailData);
        return NextResponse.json({ status: 200, data: info })
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ status: 500, data: error })
    }
}
