import path from "path";
import fs from "fs";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION, // e.g., "us-west-2"
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret key
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
  
  
  
  export function generateFileKey(uuid: string, fileName: string) {
  
  
    return `uploads/${uuid}_${fileName}`;
  }