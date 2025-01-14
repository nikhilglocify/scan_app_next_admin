import { NextResponse } from 'next/server';
import connect from '@/app/dbConfig/connect';
import PasswordReset from '@/app/models/PasswordReset';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from "@/app/models/UsersModel"

export async function POST(req: Request) {
  const { email } = await req.json();
  await connect();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Email not found.' }, { status: 404 });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

    // Save token in database
    await PasswordReset.create({
      userId: user._id,
      token,
      expiresAt,
    });

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Reset link sent to your email.' });
  } catch (error:any) {
    console.log("error",error.message)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}
