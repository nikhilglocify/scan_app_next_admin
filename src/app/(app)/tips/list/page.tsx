"use client";
import { getVideos } from "@/app/appApi/video";
import Loader from "@/app/components/global/loader";
import { VideoAttributes } from "@/app/db/models/video";
import { generateClientS3Url, generateS3Url } from "@/app/helpers/utils";
import { tree } from "next/dist/build/templates/app-page";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface VideoListProps {
  videos: VideoAttributes[];
}

const VideoList: React.FC<VideoListProps> = () => {
  const [videos, setVideos] = useState<VideoAttributes[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchVideos = async () => {
    try {
      setLoading(true);
      console.log("Loading videos");
      const data = await getVideos();

      console.log("videos=>", data);

      setVideos(data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!videos) {
      fetchVideos();
    }
  }, []);

  if (loading) {
    return (
      <Loader
        color={"black"}
        isFullScreen={true}
        message={"Fetching videos..."}
      ></Loader>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Video List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos &&
          videos.length &&
          videos.map((video) => (
            <div
              key={video.uuid}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={
                  generateClientS3Url(video?.image!) || "/placeholder-image.png"
                } // Fallback image if video image is not available
                alt={video.title}
                className="w-full h-48 object-cover"
                onClick={() => router.push(`/video/${video.uuid}`)}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {video.description || "No description available"}
                </p>
                {/* {video.temp_bucket_url && video.isEncoded && (
                  <a
                    href={generateClientS3Url(video.temp_bucket_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-500 hover:underline"
                  >
                    Watch Video
                  </a>
                )} */}
                <p
                  className={`text-sm font-semibold ${
                    video.isEncoded
                      ? "text-green-500"
                        ? video.error
                        : "text-red-400"
                      : "text-orange-500"
                  }`}
                >
                  {video.isEncoded
                    ? "Video Encoding successfull"
                      ? video.error
                      : "video enncoding failed"
                    : "Video encoding in Progress"}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VideoList;
