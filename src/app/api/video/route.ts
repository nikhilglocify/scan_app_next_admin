// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/db/config/db.config";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { badRequest, successResponseWithData, successResponseWithMessage } from "@/app/helpers/apiResponses";
import { VideoFormData, validationVideoSchema, videoSchema } from "@/app/schemas/videoSchema";
import { ReqBodyValidationresponse, validateBodyData } from "@/app/middleware/requestBodyValiation";
import AWS from "aws-sdk";
import { PassThrough } from "stream"; // Importance

import QencodeApiClient from "qencode-api"
import { v4 as uuidv4 } from 'uuid';
import { VideoAttributes } from "@/app/db/models/video";
import { where } from "sequelize";
import { generateS3Url } from "@/app/helpers/utils";
import { authMiddleware } from "@/app/helpers/verifyRoleBaseAuth";
const apiKey = process.env.QENCOD_API_KEY;
const db = connect();
// Configure AWS SDK
const s3 = new AWS.S3({
  region: process.env.AWS_REGION, // e.g., "us-west-2"
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret key
});
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle FormData
  },
};

// Function to handle file uploads
const saveFile = async (file: formidable.File) => {
  const uploadDir = path.join(process.cwd(), 'uploads'); // Ensure you have an 'uploads' directory
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, file.originalFilename || file.newFilename);
  await fs.promises.rename(file.filepath, filePath); // Move the file from temp location to desired location
  return filePath; // Return the new file path
};





async function uploadFileToLocal(file: File, uuid: string) {
  const uploadDir = path.join(process.cwd(), "uploads");
  const fileName = `${uuid}_${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  fs.mkdirSync(uploadDir, { recursive: true });

  const fileStream = fs.createWriteStream(filePath);

  const readableStream = file.stream();
  const reader = readableStream.getReader();
  let result;

  while (!(result = await reader.read()).done) {
    const chunk = result.value;
    fileStream.write(chunk);
  }

  fileStream.end();
  console.log(`File uploaded locally to ${filePath}`);

  return filePath; // Return the local file path
}

async function uploadFileToS3(file: File, uuid: string) {

  const chunks: Uint8Array[] = [];

  const readableStream = file.stream();
  const reader = readableStream.getReader();
  let result;

  while (!(result = await reader.read()).done) {
    const chunk = result.value;
    chunks.push(chunk);

  }
  const buffer = Buffer.concat(chunks);

  const file_key = generateFileKey(uuid, file.name)



  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: file_key,
    Body: buffer, // Directly stream the file to S3
    ContentType: file.type,
    // ACL: '', // Optional: Set the file permissions
  };

  await s3.upload(s3Params).promise();
  console.log(`File uploaded to S3: ${s3Params.Key}`);
}



function generateFileKey(uuid: string, fileName: string) {


  return `uploads/${uuid}_${fileName}`;
}

function generateTranscodedKey(uuid: string) {


  return `transcoded/${uuid}`;
}

const transcodeVideo = async (key: string, uuid: string) => {

  try {

    const sourceUrl = generateS3Url(key);
    // const sourceUrl = "https://testvideoplayer.s3.us-east-2.amazonaws.com/uploads/003a0603-a805-4397-9973-111b185236dd_Lombard_street__the_crookedest_street___SaveYouTube_com_.mp4"
    console.log("sourceUrl", sourceUrl)
    const qencodeApiClient = await new QencodeApiClient(apiKey);

    const transcodedPathKey = generateTranscodedKey(uuid);

    const destinationObject = {
      "url": `s3://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME}/${transcodedPathKey}`,
      "key": process.env.AWS_ACCESS_KEY_ID,
      "secret": process.env.AWS_SECRET_ACCESS_KEY,
      // "permissions": "public-read",
      // "storage_class": "REDUCED_REDUNDANCY"
    }
    console.log("destination", destinationObject)


    let transcodingParams = {
      source: sourceUrl,
      callback_url: "https://4634-112-196-2-227.ngrok-free.app/api/webhook",
      format: [
        {
          output: "advanced_hls",
          // optimize_bitrate: 1,  // Enable bitrate optimization
          destination: destinationObject,
          separate_audio: 0,
          segment_duration: 9,
          stream: [
            {
              size: "3840x2160",   // 4K resolution
              profile: "high",
              level: "5.1",
              bitrate: 12000,      // Increased bitrate for 4K
              video_codec: "libx264",
            },
            {
              size: "1920x1080",   // 1080p resolution
              profile: "main",
              level: "4.2",
              bitrate: 5000,       // Increased bitrate for 1080p
              video_codec: "libx264",
            },
            {
              size: "1280x720",    // 720p resolution
              profile: "main",
              level: "4.1",
              bitrate: 2500,       // Adjusted bitrate for 720p
              video_codec: "libx264",
            },
            {
              size: "854x480",     // 480p resolution
              profile: "main",
              level: "3.1",
              bitrate: 1200,       // Increased bitrate for 480p
              video_codec: "libx264",
            },
            {
              size: "640x360",     // 360p resolution
              profile: "main",
              level: "3.1",
              bitrate: 900,        // Increased bitrate for 360p
              video_codec: "libx264",
            },
            {
              size: "426x240",     // 240p resolution
              profile: "main",
              level: "3.1",
              bitrate: 500,        // Slightly increased bitrate for 240p
              video_codec: "libx264",
            },
          ],
        },
      ],
    };


    let task = await qencodeApiClient.CreateTask();
    const token = task?.taskToken

    await task.StartCustom(transcodingParams);




    return { job_id: token }




  } catch (error: any) {
    throw new Error(error)
  }

};

export async function POST(request: NextRequest) {
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
    const videoObj: VideoAttributes = {
      title: formBody?.title,
      description: formBody?.description
    }

    const savedVideo = await db.video.create(videoObj)
    const video_uuid = savedVideo.uuid

    //  console.log("savedVideo",savedVideo.id)
    // Upload files concurrently
    await Promise.all([
      // uploadFileToLocal(image, video_uuid),
      // uploadFileToLocal(video, video_uuid),
      uploadFileToS3(image, video_uuid),
      uploadFileToS3(video, video_uuid),
    ]);
    const image_s3_key = generateFileKey(video_uuid, image.name)
    const video_file_key = generateFileKey(video_uuid, video.name)
    const sourceUrl = generateS3Url(video_file_key);


    // await Promise.all([transcodeVideo(file_key, video_uuid)])

    const transcodedPathKey = generateTranscodedKey(video_uuid);

    const { job_id } = await transcodeVideo(video_file_key, video_uuid)

    await db.video.update({ temp_bucket_url: video_file_key, image: image_s3_key, job_id, is_uploaded: true, play_back_url: transcodedPathKey }, { where: { uuid: video_uuid } })







    return successResponseWithData(NextResponse, "Files uploaded successfully", savedVideo.dataValues);

  } catch (error: any) {
    console.error("Error", error);
    return NextResponse.json({ error: error.message || 'Failed to upload files.' }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {

    const db = await connect()

    const { success, user, message } = await authMiddleware(request)

    if (!success) return badRequest(NextResponse, message || "Not authorized")

    const videos = await db.video.findAll()


    return successResponseWithData(NextResponse, "videos fetched successfully", videos)



  } catch (error: any) {
    console.error("Server error:", error.message);

    return badRequest(NextResponse, error.message || "Internal Server error")

  }
}

export async function DELETE(request: NextRequest) {
  try {

    const db = await connect()
    const body = await request.json()
    const { success, user, message } = await authMiddleware(request)

    if (!success) return badRequest(NextResponse, message || "Not authorized")

    const videos = await db.video.findAll()


    return successResponseWithData(NextResponse, "videos fetched successfully", videos)



  } catch (error: any) {
    console.error("Server error:", error.message);

    return badRequest(NextResponse, error.message || "Internal Server error")

  }
}

