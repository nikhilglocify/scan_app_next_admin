
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData, unauthorizedError } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/Tip"
import { authMiddleware } from "@/app/helpers/auth/verifyRoleBaseAuth";


export async function GET(request: NextRequest) {

  try {
    await connect()
    const { user, success, message } = await authMiddleware(request)
    if (!success) {

      return unauthorizedError(NextResponse, message || "Not Authorized")
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let tip = await Tip.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ date: 'desc', updatedAt: "desc", createdAt: "desc" }).lean();

    if (!tip) {
      tip = await Tip.findOne({
        date: { $lt: endOfDay },isDeleted:false
      }).sort({ date: 'desc', updatedAt: "desc", createdAt: "desc" }).lean();


      console.log("No Tip for the day sending the last availabe")
      
    }

    console.log("TIp Data",tip)


    return successResponseWithData(NextResponse, "successfully fetched Tips", tip||{})

  } catch (error: any) {

    return badRequest(NextRequest, error.message || "something went wrong")


  }

}

export const revalidate = 10;