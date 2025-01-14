
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData, unauthorizedError } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/tip"
import { ReqBodyValidationresponse, validateBodyData } from "@/app/helpers/validation/requestBodyValiation";
import { ediTipSchema, tipSchema } from "@/app/schemas/tipSchema";
import { generateFileKey, uploadFileToLocal, uploadFileToS3 } from "@/app/helpers/upload/fileUpload";
// import connect from "@/app/dbConfig/connect";
import { getStore } from "@netlify/blobs";
import { authMiddleware } from "@/app/helpers/auth/verifyRoleBaseAuth";
const store = getStore({
  name: 'scan_app_tip_blob',
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_BLOB_TOKEN,
  consistency: "strong"
})

export async function POST(request: NextRequest) {
  try {

    await connect()
    const { user, success, message } = await authMiddleware(request)

    if (!success) {

      return unauthorizedError(NextResponse, message || "Not Authorized")
    }

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


    if (image) {
      // const file_key = generateFileKey(saveTip._id, "FileName")
      // await store.set(file_key, image);
      // console.log("filePath", file_key)
      // const filePath = await uploadFileToLocal(image, saveTip._id)
      const file_key = await uploadFileToS3(image as any, saveTip._id)

      await Tip.findByIdAndUpdate(saveTip._id, { isImageUploaded: true, image: file_key })
    }



    return successResponseWithData(NextResponse, "Tip added successfully")
  } catch (error: any) {
    console.log("error", error.message)
    return badRequest(NextResponse, error.message || "something went wrong")

  }

}

export async function PUT(request: NextRequest) {
  try {
    await connect()
    const { user, success, message } = await authMiddleware(request)

    if (!success) {

      return unauthorizedError(NextResponse, message || "Not Authorized")
    }
    const formData = await request.formData();
    let formPayload = Object.fromEntries(formData);
    const image = formData.get("image");

    const formValidationData: ReqBodyValidationresponse = validateBodyData(ediTipSchema, formPayload);
    if (!formValidationData.isValidated) {
      return badRequest(NextResponse, formValidationData.message, formValidationData.error);
    }

    const formBody: TipModel = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    let tipObj: TipModel = {
      description: formBody?.description,
      date: formBody?.date,
    }



    if ((image instanceof File) && formBody._id) {

      // const file_key = generateFileKey(formBody._id, "FileName")
      // await store.set(file_key, image);

      const file_key = await uploadFileToS3(image as any, formBody._id)
      console.log("filePath", file_key)
      await Tip.findByIdAndUpdate(formBody._id, { ...tipObj, isImageUploaded: true, image: file_key })
    } else {

      await Tip.findByIdAndUpdate(formBody._id, tipObj)

    }



    return successResponseWithData(NextResponse, "Tip edited succesfully")
  } catch (error: any) {
    console.log("error", error.message)
    return badRequest(NextResponse, error.message || "error")

  }

}

export async function GET(request: NextRequest) {

  try {
    await connect()
    const { user, success, message } = await authMiddleware(request)

    if (!success) {

      return unauthorizedError(NextResponse, message || "Not Authorized")
    }

    const tips = await Tip.find().sort({ date: 'desc' })


    return successResponseWithData(NextResponse, "successfully fetched Tips", tips)

  } catch (error: any) {

    return badRequest(NextResponse, error.message || "something went wrong")


  }

}