
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/tip"


export async function GET(request: NextRequest) {

  try {
    await connect()

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let tip = await Tip.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ date: 'desc', updatedAt: "desc", createdAt: "desc" }).lean();

    if (tip) {
      console.log("Today's tip found", tip)
    } else {

      tip = await Tip.findOne({
        date: { $lt: endOfDay },
      }).sort({ date: 'desc', updatedAt: "desc", createdAt: "desc" }).lean();


      console.log("No Tip for the day sending the availabe")
    }


    return successResponseWithData(NextResponse, "successfully fetched Tips", tip!)

  } catch (error: any) {

    return badRequest(NextRequest, error.message || "something went wrong")


  }

}