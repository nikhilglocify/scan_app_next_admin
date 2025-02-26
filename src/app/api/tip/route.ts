
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData, unauthorizedError } from "@/app/helpers/apiResponses"
import connect from '@/app/dbConfig/connect';
import Tip, { TipModel } from "@/app/models/Tip"
import { ReqBodyValidationresponse, validateBodyData } from "@/app/helpers/validation/requestBodyValiation";
import { ediTipSchema, tipSchema } from "@/app/schemas/tipSchema";
import { generateFileKey, uploadFileToAwsS3, uploadFileToLocal, uploadFileToS3 } from "@/app/helpers/upload/fileUpload";
import { authMiddleware } from "@/app/helpers/auth/verifyRoleBaseAuth";
import mongoose from "mongoose";


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


    // // Check if valid files are received
    // if (!(image instanceof File)) {
    //   return badRequest(NextResponse, "No valid files received")
    // }

    const formBody: TipModel = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    const tipObj: TipModel = {
      description: formBody?.description,
      date: formBody?.date,
      userId:new mongoose.Types.ObjectId(user?._id)
    }


    const saveTip = await Tip.create(tipObj)


    if (image) {
    
      const file_key = await uploadFileToAwsS3(image as any, saveTip._id)

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

    let tipObj:Partial<TipModel> = {
      description: formBody?.description,
      date: formBody?.date,
    }



    if ((image instanceof File) && formBody._id) {

      // const file_key = generateFileKey(formBody._id, "FileName")
      // await store.set(file_key, image);
      
      // const file_key = await uploadFileToS3(image as any, formBody._id)
      const file_key = await uploadFileToAwsS3(image as any, formBody._id)

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

    const tips = await Tip.find({isDeleted:false}).sort({ date: 'desc' })


    return successResponseWithData(NextResponse, "successfully fetched Tips", tips)

  } catch (error: any) {

    return badRequest(NextResponse, error.message || "something went wrong")


  }

}



export async function DELETE(request: NextRequest) {
  try {
    await connect()
    const { user, success, message } = await authMiddleware(request)
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id')
    

    if (!success) {

      return unauthorizedError(NextResponse, message || "Not Authorized")
    }

    if(!id){
        return  badRequest(NextResponse, "id is required")
    }
    

    
    await Tip.findByIdAndUpdate(id, { isDeleted:true })



    return successResponseWithData(NextResponse, "Tip edited succesfully")
  } catch (error: any) {
    console.log("error", error.message)
    return badRequest(NextResponse, error.message || "error")

  }

}

export const revalidate = 10;