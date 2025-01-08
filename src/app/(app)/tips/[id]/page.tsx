"use client";
import React, { useEffect, useState } from "react";
import { VideoAttributes } from "@/app/db/models/video";
import { useParams } from "next/navigation";
import { getVideoById } from "@/app/appApi/video";
import { setInterval } from "timers/promises";
import Loader from "@/app/components/global/loader";
import CircularProgress from "@/app/components/global/circularProgress";
import { generateCdnS3Url, generateClientS3Url } from "@/app/helpers/utils";
import VideoPlayer from "@/app/components/video/VideoPlayer";

interface VideoDetailsProps {
  video: VideoAttributes;
  encodingProgress: number; // Percentage progress for encoding
  error?: string; // Error message if any
}
const video: VideoAttributes = {
  id: 1,
  title: "Sample Video",
  description: "A sample video for testing",
  image: "https://example.com/image/1.jpg",
  isEncoded: false,
  play_back_url: "https://example.com/video/1",
  encoding_status: "in_progress",
};
const encodingProgress = 60; // Replace with actual encoding progress percentage
const error = "";
export interface VideoAttributes2 {
  id: number;
  title: string;
  temp_bucket_url: string;
  play_back_url: string | null;
  description: string;
  image: string;
  uuid: string;
  isEncoded: boolean;
  is_uploaded: boolean;
  job_id: string;
  encoding_status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  status: string;
  percent: number; // Percentage of encoding progress
  error: number; // Error code (0 means no error)
  error_description: string | null; // Description of the error, if any
}
const VideoDetails: React.FC = () => {
  const params = useParams();
  const uuid = params.id as string;
  const [video, setVideo] = useState<VideoAttributes2 | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchVideoData = async (uuid: string, interval?: number) => {
    try {
      const data = await getVideoById(uuid);

      setVideo(data.data);

      if (data.data.percent !== 100) {
        setTimeout(() => {
          fetchVideoData(uuid);
        }, 5000);
      } else {
        console.log("Video encoding completed");
        setVideo((prev) => {
          if (!prev) return data.data;
          return {
            ...prev,
            isEncoded: true,
            play_back_url: data.data.play_back_url,
          };
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) {
      fetchVideoData(uuid);
    }
  }, []);

  if (loading) {
    return (
      <Loader
        color={"black"}
        isFullScreen={true}
        message={"Fetching video data..."}
      ></Loader>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {video && (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-3xl font-bold text-center mb-6">{video.title}</h1>

          {/* Video Thumbnail */}

          {video.isEncoded ? (
            <VideoPlayer
              url={generateCdnS3Url(`${video.play_back_url}/playlist.m3u8`!)}
            />
          ) : (
            <img
              src={generateClientS3Url(video.image) || "/placeholder-image.png"}
              alt={video.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          {/* Video Description */}
          <p className="text-gray-600 text-sm mb-4">
            {video.description || "No description available"}
          </p>

          {/* Encoding Status */}
          <div className="mb-4">
            <p
              className={`text-sm font-semibold ${
                video.isEncoded
                  ? "text-green-500"
                  : video.error
                  ? "text-red-400"
                  : "text-orange-500"
              }`}
            >
              {video.isEncoded
                ? "Video Encoded successfully"
                : video.error
                ? "video enncoding failed"
                : "Video encoding in Progress"}
            </p>
          </div>

          {/* Encoding Progress Bar */}
          {!video.isEncoded && (
            <CircularProgress percent={video.percent ? video.percent : 5} />
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mt-4">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Delete Video Button */}
          {
            <button className="block  bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-center mt-6">
              Delete video
            </button>
          }
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
