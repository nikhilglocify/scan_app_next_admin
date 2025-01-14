import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs'
import connect from '@/app/dbConfig/connect';
import PasswordReset from '@/app/models/PasswordReset';;
import User from "@/app/models/UsersModel"
import { badRequest, successResponseWithMessage } from '@/app/helpers/apiResponses';


export async function POST(req: Request) {
  const { token, password } = await req.json();
  await connect();

  try {

    const resetRecord = await PasswordReset.findOne({ token }).lean();
    

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return badRequest(NextResponse,"Token is invalid or expired")
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
   
    await User.findByIdAndUpdate(resetRecord.userId, { password: hashedPassword});

    // Delete the token
    await PasswordReset.deleteOne({ _id: resetRecord._id });

    return successResponseWithMessage(NextResponse,'Password reset successful.')
  } catch (error:any) {
    console.log("error",error?.message)
    return badRequest(NextResponse,'An error occurred.')
  }
}
