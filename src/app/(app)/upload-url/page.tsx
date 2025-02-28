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
        toast.error("Please select a file to upload.");
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
  };

  return (
    <div className=" h-[calc(100vh-56px)]  flex justify-center items-center">
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-100 rounded-lg shadow-md max-w-sm mx-auto justify-center">
      <h1 className="text-2xl font-semibold text-gray-800">Upload  JSON File</h1>
      <input
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={uploadFile}
        disabled={uploading}
        className="w-full p-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
    </div>
  );
}
