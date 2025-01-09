
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import  connect  from '@/app/dbConfig/connect';
import Tip from "@/app/models/tip"
import { ReqBodyValidationresponse, validateBodyData } from "@/app/helpers/validation/requestBodyValiation";
import { validationVideoSchema } from "@/app/schemas/tipSchema";



export async function POST(request:NextRequest){
    try {
        // Parse the incoming form data
    const formData = await request.formData();
    const formPayload = Object.fromEntries(formData);
    const image = formData.get("image");
    const video = formData.get("video");

    const formValidationData: ReqBodyValidationresponse = validateBodyData(validationVideoSchema, formPayload);
    if (!formValidationData.isValidated) {
      return badRequest(NextResponse, formValidationData.message, formValidationData.error);
    }

    // Check if valid files are received
    if (!(image instanceof File) || !(video instanceof File)) {
      return badRequest(NextResponse, "No valid files received")
    }
    console.log("image", image)
    const formBody = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    return successResponseWithData(NextResponse,"success")
    } catch (error:any) {
        console.log("error",error.message)
        return badRequest(NextResponse,"error")
        
    }

}