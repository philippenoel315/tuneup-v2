import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: '"Affutage Pro" <admin@affutagepro.com>',
      to,
      subject,
      text,
      html
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export { sendEmail };
