"use client";
import { getTips } from "@/app/appApi/Tip";
import Loader from "@/app/components/global/loader";
import AddTipModal from "@/app/components/tips/AddTipModal";
import TipCard from "@/app/components/tips/TipCard";
import { TipModel } from "@/app/models/tip";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const router = useRouter();
  const [tipData, setTipData] = useState<TipModel[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchTips, setFetchTips] = useState(true);
  const [isEdit,setIsEdit]=useState(false)
  const [selectedTip,setSelectedTip]=useState<TipModel|null>(null)
  const fetchDailyTip = async () => {
    try {
      setLoading(true);
      const data = await getTips();

      setTipData(data?.data);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    fetchDailyTip();
  }, [fetchTips]);

  // const handleEdit=(tip:TipModel)=>{

  // }

  if (loading) {
    return (
      <Loader color="black" isFullScreen={true} message="Fetching tips .." />
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Tips List</h1>
      {/* <Button>Add Tip</Button>
       */}
      <AddTipModal
      isEdit={isEdit}
        setFetchTips={setFetchTips}
        fetchTips={fetchTips}
      ></AddTipModal>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tipData &&
          tipData.length &&
          tipData.map((tip: TipModel, idx) => (
            <TipCard
              key={idx}
              onDelete={() => console.log("delete")}
              onEdit={(tip:TipModel) => console.log("edit")}
              tip={tip}
            />
            // <div
            //   key={tip._id}
            //   className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            // >
            //   <img
            //     src={ "/placeholder-image.png"} // Fallback image if tip image is not available
            //     // alt={tip.title}
            //     className="w-full h-48 object-cover"
            //     onClick={() => router.push(`/tip/${tip.uuid}`)}
            //   />
            //   <div className="p-4">
            //     <h2 className="text-xl font-semibold mb-2">{tip.title}</h2>
            //     <p className="text-gray-600 text-sm mb-4">
            //       {tip.description || "No description available"}
            //     </p>
            //     {/* {tip.temp_bucket_url && tip.isEncoded && (
            //       <a
            //         href={generateClientS3Url(tip.temp_bucket_url)}
            //         target="_blank"
            //         rel="noopener noreferrer"
            //         className="block text-blue-500 hover:underline"
            //       >
            //         Watch tip
            //       </a>
            //     )} */}
            //     {/* <p
            //       className={`text-sm font-semibold ${
            //         tip.isEncoded
            //           ? "text-green-500"
            //             ? tip.error
            //             : "text-red-400"
            //           : "text-orange-500"
            //       }`}
            //     >
            //       {tip.isEncoded
            //         ? "tip Encoding successfull"
            //           ? tip.error
            //           : "tip enncoding failed"
            //         : "tip encoding in Progress"}
            //     </p> */}
            //   </div>
            // </div>
          ))}
      </div>
    </div>
  );
}

export default page;
