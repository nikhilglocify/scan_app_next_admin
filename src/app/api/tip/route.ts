
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/tip"
import { ReqBodyValidationresponse, validateBodyData } from "@/app/helpers/validation/requestBodyValiation";
import { ediTipSchema, tipSchema } from "@/app/schemas/tipSchema";
import { uploadFileToLocal, uploadFileToS3 } from "@/app/helpers/upload/fileUpload";
// import connect from "@/app/dbConfig/connect";
connect()

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
    // const filePath = await uploadFileToS3(image, saveTip._id)
    console.log("filePath",filePath)

    await Tip.findByIdAndUpdate(saveTip._id, { isImageUploaded: true, image: filePath })

    return successResponseWithData(NextResponse, "success")
  } catch (error: any) {
    console.log("error", error.message)
    return badRequest(NextResponse, error.message || "something went wrong")

  }

}

export async function PUT(request: NextRequest) {
  try {
    console.log("running",)
    const formData = await request.formData();
    let formPayload = Object.fromEntries(formData);
    const image = formData.get("image");

    const formValidationData: ReqBodyValidationresponse = validateBodyData(ediTipSchema, formPayload);
    if (!formValidationData.isValidated) {
      return badRequest(NextResponse, formValidationData.message, formValidationData.error);
    }

    // Check if valid files are received
    // if ((image instanceof File)) {
    //   return badRequest(NextResponse, "No valid files received")
    // }

    const formBody: TipModel = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    const tipObj: TipModel = {
      description: formBody?.description,
      date: formBody?.date,
    }


    const editTip = await Tip.findByIdAndUpdate(formBody._id,tipObj)
    // console.log("saveTip", formBody._id, saveTip._id)

    if ((image instanceof File) && formBody._id) {

      const filePath = await uploadFileToLocal(image, formBody._id)

      await Tip.findByIdAndUpdate(formBody._id, { isImageUploaded: true, image: filePath })
    }


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

    return badRequest(NextResponse, error.message || "something went wrong")


  }

}