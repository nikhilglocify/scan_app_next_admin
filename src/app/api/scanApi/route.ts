import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import { NextRequest, NextResponse } from "next/server"
// import urlData from "../../script/scanScript/compilation_array2.json"
import connect from "@/app/dbConfig/connect"

export async function GET(request: NextRequest) {
    try {

        await connect()


        const data = {
            url: [
                "abc"
            ]
        }

        return successResponseWithData(NextResponse, "Book fetched successfully", data)



    } catch (error: any) {
        console.error("Server error:", error.message);

        return badRequest(NextResponse, error.message || "Internal Server error")

    }
}