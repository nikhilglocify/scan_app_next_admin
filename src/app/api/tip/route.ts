
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/tip"
import { ReqBodyValidationresponse, validateBodyData } from "@/app/helpers/validation/requestBodyValiation";
import { ediTipSchema, tipSchema } from "@/app/schemas/tipSchema";
import { generateFileKey, uploadFileToLocal, uploadFileToS3 } from "@/app/helpers/upload/fileUpload";
// import connect from "@/app/dbConfig/connect";
import { getStore } from "@netlify/blobs";
const store = getStore({
  name: 'scan_app_tip_blob',
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_BLOB_TOKEN,
  consistency: "strong"
})

export async function POST(request: NextRequest) {
  try {
    console.log("running here  instanceof debuf")
    await connect()

    const formData = await request.formData();
    let formPayload = Object.fromEntries(formData);
    const image = formData.get("image");

  


    // const formValidationData: ReqBodyValidationresponse = validateBodyData(tipSchema, formPayload);
    // if (!formValidationData.isValidated) {
    //   return badRequest(NextResponse, formValidationData.message, formValidationData.error);
    // }

    console.log("running here  instanceof")
    // Check if valid files are received
    // if (!(image instanceof File)) {
    //   console.log("File code running here  instanceof")
    //   return badRequest(NextResponse, "No valid files received")
    // }

    const formBody: TipModel = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    const tipObj: TipModel = {
      description: formBody?.description,
      date: formBody?.date,
    }


    const saveTip = await Tip.create(tipObj)
    console.log("saveTip", saveTip, saveTip._id)


    if (image) {
      // const file_key = generateFileKey(saveTip._id, "FileName")
      // await store.set(file_key, image);
      // console.log("filePath", file_key)
      const file_key = await uploadFileToS3(image as any, saveTip._id)

      await Tip.findByIdAndUpdate(saveTip._id, { isImageUploaded: true, image: file_key })
    }


    // const filePath = await uploadFileToLocal(image, saveTip._id)
    // const filePath = await uploadFileToS3(image as any, saveTip._id)


    return successResponseWithData(NextResponse, "success")
  } catch (error: any) {
    console.log("error", error.message)
    return badRequest(NextResponse, error.message || "something went wrong")

  }

}

export async function PUT(request: NextRequest) {
  try {
    await connect()
    console.log("running",)
    const formData = await request.formData();
    let formPayload = Object.fromEntries(formData);
    const image = formData.get("image");

    // const formValidationData: ReqBodyValidationresponse = validateBodyData(ediTipSchema, formPayload);
    

    const formBody: TipModel = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    const tipObj: TipModel = {
      description: formBody?.description,
      date: formBody?.date,
    }


    const editTip = await Tip.findByIdAndUpdate(formBody._id, tipObj)
    // console.log("saveTip", formBody._id, saveTip._id)

    // if ((image instanceof File) && formBody._id) {

    //   const filePath = await uploadFileToLocal(image, formBody._id)

    //   await Tip.findByIdAndUpdate(formBody._id, { isImageUploaded: true, image: filePath })
    // }

    if (image && formBody._id) {
      // const file_key = generateFileKey(formBody._id, "FileName")
      // await store.set(file_key, image);
      
      const file_key = await uploadFileToS3(image as any, formBody._id)
      console.log("filePath", file_key)
      await Tip.findByIdAndUpdate(formBody._id, { isImageUploaded: true, image: file_key })
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

    const tips = await Tip.find().sort({ date: 'desc' })


    return successResponseWithData(NextResponse, "successfully fetched Tips", tips)

  } catch (error: any) {

    return badRequest(NextResponse, error.message || "something went wrong")


  }

}