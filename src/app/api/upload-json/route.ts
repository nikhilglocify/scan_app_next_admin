import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "fs/promises";
import { Readable } from "stream";
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses";
import { urlFile } from "@/app/helpers/interface"
// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWSREGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEYID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESSKEY!,
    },
});

// Disable body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper to convert request to Node.js readable stream
function toNodeReadableStream(request: Request): any {
    const reader = request.body?.getReader();
    const stream = new Readable({
        async read() {
            if (!reader) {
                this.push(null);
                return;
            }
            const { value, done } = await reader.read();
            if (done) {
                this.push(null);
            } else {
                this.push(value);
            }
        },
    });

    stream.headers = Object.fromEntries(request.headers.entries()) as any;
    stream.method = request.method;
    stream.url = request.url;

    return stream;
}

// POST handler
export async function POST(request: Request) {
    try {
        const nodeRequest = toNodeReadableStream(request);

        const form = formidable({
            multiples: false,
            uploadDir: "/tmp", // Temporary file storage
            keepExtensions: true, // Keep file extensions
        });

        const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
            (resolve, reject) => {
                form.parse(nodeRequest as any, (err, fields, files) => {
                    if (err) reject(err);
                    else resolve({ fields, files });
                });
            }
        );

        console.log("Files received:", files);

        const file = files.file ? files.file[0] : null; // Handle as an array
        if (!file || !file.filepath) {
            console.error("Invalid file object:", file);
            return NextResponse.json({ error: "No file uploaded or invalid file object" }, { status: 400 });
        }

        // const fileContent = await fs.readFile(file.filepath);
        const fileName = `uploads/${Date.now()}-${file.originalFilename}`;

        // Read the file content
        const fileContent = await fs.readFile(file.filepath, 'utf-8');  // Ensure encoding is 'utf-8'

        // Validate if the file is valid JSON
        let jsonData;
        try {
            jsonData = JSON.parse(fileContent) as urlFile;
            if (!jsonData?.term || jsonData?.term.length < 5) {
                const errorMsg = jsonData?.term?.length < 5 ? "Minimum of 5 urls must be in the json" : "Invalid Url file format term array  not found"

                return badRequest(NextResponse, errorMsg)
            }


        } catch (err) {
            console.error("Invalid JSON format:", err);
            return badRequest(NextResponse, "Invalid JSON format")
        }

        if (!jsonData || typeof jsonData !== 'object') {
            return badRequest(NextResponse, "Invalid JSON structure")

        }


        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: fileName,
            Body: fileContent,
            ContentType: "application/json",
        });

        // await s3Client.send(command);

        return NextResponse.json({ message: "File uploaded successfully", key: fileName });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const fileKey = searchParams.get('fileKey'); // Get fileKey from query params
    const sitesToVisit = searchParams.get('sitesToVisit')



    if (!fileKey) {
        return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    try {
        // Fetch file from S3
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: fileKey,
        });

        const data = await s3Client.send(command);

        // Read the S3 object data into a buffer
        const streamToString = (stream: Readable) => {
            return new Promise<string>((resolve, reject) => {
                const chunks: Uint8Array[] = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
                stream.on('error', reject);
            });
        };

        const fileContent = await streamToString(data.Body as Readable);

        // Parse the JSON content from the file
        const jsonData = JSON.parse(fileContent);
        const urls = getUrls(jsonData?.term, Number(sitesToVisit) || 5)

        // Send the JSON data as a response
        return successResponseWithData(NextResponse, "succesfully fetched urls", urls)
    } catch (error) {
        console.error('Error retrieving file from S3:', error);
        return NextResponse.json({ error: 'Error retrieving file from S3' }, { status: 500 });
    }
}
export const getUrls = (urls: string[], numUrlsToSelect: number) => {
    const shuffledUrls = [...urls].sort(() => Math.random() - 0.5);
    return shuffledUrls.slice(0, numUrlsToSelect);
}
