import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import { authMiddleware } from "@/app/helpers/verifyRoleBaseAuth"
import { NextRequest, NextResponse } from "next/server"
import { connect } from "../../../db/config/db.config"
import axios from "axios"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {

        const db = await connect()

        const uuid = params.id

        const { success, user, message } = await authMiddleware(request)

        if (!success) return badRequest(NextResponse, message || "Not authorized")

        const video = await db.video.findOne({ where: { uuid: uuid } })

        const job_id = video?.job_id

        if (job_id && !video.isEncoded) {
            const job_status = await axios.post(
                'https://api.qencode.com/v1/status',
                new URLSearchParams({
                    task_tokens: job_id,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            console.log("job_status", job_status.data)

            const job_data = job_status.data?.statuses[`${job_id}`]
            const { status, percent, error, error_description } = job_data





            return successResponseWithData(NextResponse, "videos fetched successfully", { ...video.dataValues, status, percent, error, error_description })
        } else if (job_id) {

            return successResponseWithData(NextResponse, "videos fetched successfully", { ...video.dataValues, status: "completed", percent: 100, error: null, error_description: null })

        } else {

            return badRequest(NextResponse, "No encoding task for the video")
        }









    } catch (error: any) {
        console.error("Server error:", error.message);

        return badRequest(NextResponse, error.message || "Internal Server error")

    }
}