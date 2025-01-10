


import { badRequest, successResponseWithData } from '@/app/helpers/apiResponses';
import { getStore } from '@netlify/blobs';
import { NextRequest, NextResponse } from 'next/server';

const store = getStore({
    name: 'scan_app_tip_blob',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOB_TOKEN,
    consistency: "strong"
  })

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
        return badRequest(NextResponse, "File key is required")
    }
    const blob = await store.get(key?key:"uploads/6780d43cf7869cc6d758cd6b_FileName", { type: "stream", });
    console.log("blob ss",blob)

    if (!blob) {
        return badRequest(NextResponse, "upload file not found")
    }
    // return new Response(blob);
    return new NextResponse(blob, {
        status: 200,
        headers: {
            'Content-Type': 'image/jpeg', // Adjust MIME type to match your file (e.g., image/png)
            'Content-Disposition': `inline; filename="${key}"`,
        },
    });

    // const contentType = "application/octet-stream"; // Update this if you know the file type

    // return new NextResponse(blob, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": contentType,
    //     "Content-Disposition": `inline; filename="${key}"`,
    //   },
    // });
};