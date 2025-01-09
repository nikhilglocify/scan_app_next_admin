
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import  connect  from '@/app/dbConfig/connect';
import Tip from "@/app/models/tip"
import { ReqBodyValidationresponse, validateBodyData } from "@/app/helpers/validation/requestBodyValiation";
import { tipSchema } from "@/app/schemas/tipSchema";



export async function POST(request:NextRequest){
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
    console.log("image", image)
    const formBody = JSON.parse(JSON.stringify(formPayload))
    console.log("formBody", formBody)

    return successResponseWithData(NextResponse,"success")
    } catch (error:any) {
        console.log("error",error.message)
        return badRequest(NextResponse,"error")
        
    }

}