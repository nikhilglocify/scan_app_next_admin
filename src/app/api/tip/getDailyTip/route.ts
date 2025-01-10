
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/tip"






export async function GET(request: NextRequest) {

  try {

    const tips = await Tip.find().sort({ date: 'desc' }) 


    return successResponseWithData(NextResponse, "successfully fetched Tips", JSON.stringify(tips[0]))

  } catch (error: any) {

    return badRequest(NextRequest, error.message || "something went wrong")


  }

}