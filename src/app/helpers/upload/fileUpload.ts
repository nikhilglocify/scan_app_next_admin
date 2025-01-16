import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3 = new AWS.S3({
  region: process.env.AWSREGION, 
  accessKeyId: process.env.AWS_ACCESS_KEYID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY, 
});

export const s3Client = new S3Client({
  region: process.env.AWSREGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEYID!, 
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY!, 
  },
});



export async function uploadFileToLocal(file: File, id: string) {
  
    const uploadDir = path.join(process.cwd(), "uploads");

    
    
    const fileName = `${id}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    const relativePath = path.join("uploads", fileName); 
  
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
  
    return relativePath; // Return the local file path
  }


  export async function uploadFileToS3(file: File, uuid: string) {
    console.log("running  uploadFileToS3",{file,uuid})

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
    return s3Params.Key
  }


  export async function uploadFileToAwsS3(file: File, uuid: string) {
    console.log("Running uploadFileToS3", { file, uuid });
  
    const chunks: Uint8Array[] = [];
    const readableStream = file.stream();
    const reader = readableStream.getReader();
    let result;
  
    while (!(result = await reader.read()).done) {
      const chunk = result.value;
      chunks.push(chunk);
    }
  
    const buffer = Buffer.concat(chunks); // Combine all chunks into a buffer
    const fileKey = generateFileKey(uuid, file.name); // Generate S3 key for the file
  
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME!, // Your S3 bucket name
      Key: fileKey, // Key (file path in the bucket)
      Body: buffer, // File content
      ContentType: file.type, // MIME type of the file
      // ACL: 'public-read', // Optional: Set file permissions
    };
  
    try {
      // Upload file to S3
      const command = new PutObjectCommand(s3Params);
      await s3Client.send(command);
      console.log(`File uploaded to S3: ${s3Params.Key}`);
      return s3Params.Key;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  }
  
  
  
  export function generateFileKey(uuid: string, fileName: string) {
  
  
    return `uploads/${uuid}_${fileName}`;
  }