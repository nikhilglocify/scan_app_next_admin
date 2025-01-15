import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import { NextRequest, NextResponse } from "next/server"
// import urlData from "../../script/scanScript/compilation_array2.json"
import connect from "@/app/dbConfig/connect"

export async function GET(request: NextRequest) {
    try {

        await connect()


        

        return successResponseWithData(NextResponse, "server working")



    } catch (error: any) {
        console.error("Server error:", error.message);

        return badRequest(NextResponse, error.message || "Internal Server error")

    }
}