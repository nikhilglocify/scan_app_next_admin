"use client";

import { uplodJsonUrl } from "@/app/appApi/JsonUpload";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UploadJson() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      await uplodJsonUrl(file);
      toast.success("file uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
    // try {
    //   const formData = new FormData();
    //   formData.append("file", file);

    //   const response = await fetch("/api/upload-json", {
    //     method: "POST",
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     console.log("Error response",response)
    //     throw new Error("Failed to upload file");
    //   }

    //   const data = await response.json();
    //   alert(`File uploaded successfully! S3 Key: ${data.key}`);
    // } catch (error) {
    //   console.error("Error uploading file:", error);
    //   alert("Error uploading file.");
    // } finally {
    //   setUploading(false);
    // }
  };

  return (
    <div>
      <h1>Upload JSON File</h1>
      <input
        type="file"
        accept="application/json"
        onChange={handleFileChange}
      />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
