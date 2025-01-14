import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs'
import connect from '@/app/dbConfig/connect';
import PasswordReset from '@/app/models/PasswordReset';;
import User from "@/app/models/UsersModel"


export async function POST(req: Request) {
  const { token, password } = await req.json();
  await connect();

  try {
    console.log("token",token)
    const resetRecord = await PasswordReset.findOne({ token }).lean();
    console.log(resetRecord,"resetRecord",password)

    if (!resetRecord || resetRecord.expiresAt < new Date() || resetRecord?.isTokenUsed) {
      return NextResponse.json({ error: 'Token is invalid or expired.' }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log("hashedPassword",hashedPassword,resetRecord.userId)
    // Update the user's password
    await User.findByIdAndUpdate(resetRecord.userId, { password: hashedPassword});

    // Delete the token
    // await PasswordReset.deleteOne({ _id: resetRecord._id });

    return NextResponse.json({ message: 'Password reset successful.' });
  } catch (error:any) {
    console.log("error",error?.message)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}
