import path from "path";
import fs from "fs";

async function uploadFileToLocal(file: File, id: string) {
    const uploadDir = path.join(process.cwd(), "uploads");
    const fileName = `${id}_${file.name}`;
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