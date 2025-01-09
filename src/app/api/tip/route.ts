
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/tip"
import { ReqBodyValidationresponse, validateBodyData } from "@/app/helpers/validation/requestBodyValiation";
import { tipSchema } from "@/app/schemas/tipSchema";
import { uploadFileToLocal } from "@/app/helpers/upload/fileUpload";



export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();
    let formPayload = Object.fromEntries(formData);
    const image = formData.get("image");

    const formValidationData: ReqBodyValidationresponse = validateBodyData(tipSchema, formPayload);
    if (!formValidationData.isValidated) {
      return badRequest(NextResponse, formValidationData.message, formValidationData.error);
    }

    // Check if valid files are received
    if (!(image instanceof File)) {
      return badRequest(NextResponse, "No valid files received")
    }

    const formBody: TipModel = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    const tipObj: TipModel = {
      description: formBody?.description,
      date: formBody?.date,
    }


    const saveTip = await Tip.create(tipObj)
    console.log("saveTip", saveTip, saveTip._id)


    const filePath = await uploadFileToLocal(image, saveTip._id)

    await Tip.findByIdAndUpdate(saveTip._id, { isImageUploaded: true, image: filePath })

    return successResponseWithData(NextResponse, "success")
  } catch (error: any) {
    console.log("error", error.message)
    return badRequest(NextResponse, "error")

  }

}

export async function GET(request: NextRequest) {

  try {

    const tips = await Tip.find().sort({ date: 'desc' }) 


    return successResponseWithData(NextResponse, "successfully fetched Tips", tips)

  } catch (error: any) {

    return badRequest(NextRequest, error.message || "something went wrong")


  }

}