import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import { NextRequest, NextResponse } from "next/server"
// import urlData from "../../script/scanScript/compilation_array2.json"
import connect from "@/app/dbConfig/connect"

export async function GET(request: NextRequest) {
    try {

        await connect()


        console.log("Request received", request)

    const formData = await request.formData();

        

        return successResponseWithData(NextResponse, "server working")



    } catch (error: any) {
        console.error("Server error:", error.message);

        return badRequest(NextResponse, error.message || "Internal Server error")

    }
}

export async function POST(request: NextRequest) {
    try {

        await connect()


        console.log("Request received POST", request, new Date().toLocaleTimeString())


        const bodyText = await request.text();

    // Parse the URL-encoded string into an object
    const params = new URLSearchParams(bodyText);
    const parsedBody = Object.fromEntries(params);

    console.log('Received Webhook Data:', parsedBody);
        

        return successResponseWithData(NextResponse, "server working")



    } catch (error: any) {
        console.error("Server error:", error.message);

        return badRequest(NextResponse, error.message || "Internal Server error")

    }
}