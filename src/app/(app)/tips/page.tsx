"use client";
import { deleteTip, getTips } from "@/app/appApi/Tip";
import Loader from "@/components/global/loader";
import AddTipModal from "@/components/Tip/AddTipModal";
import TipCard from "@/components/Tip/TipCard";
import { TipModel } from "@/app/models/Tip";
import { Button } from "@/components/ui/button";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  ediTipSchema,
  initialDefaultValues,
  tipFormData,
  tipSchema,
} from "@/app/schemas/tipSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { DeleteConfirmation } from "@/components/global/DeleteConfirmation";
import toast from "react-hot-toast";

function page() {
  const router = useRouter();
  const [tipData, setTipData] = useState<TipModel[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchTips, setFetchTips] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");

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

  const methods = useForm<tipFormData>({
    resolver: zodResolver(isEdit ? ediTipSchema : tipSchema),
    defaultValues: initialDefaultValues,
  });
  useEffect(() => {
    fetchDailyTip();
  }, [fetchTips]);

  const { getValues, setValue, formState, reset } = methods;

  const handleEdit = (tip: TipModel, imagePreview: string) => {
    setIsEdit(true);
    setOpen(true);
    console.log("tip image", tip.image);
    if (imagePreview) {
      setImagePreview(imagePreview);
    }

    reset({
      description: tip.description,
      date: tip.date,
      _id: tip._id,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    console.log("delete", id);
    setOpenAlert(true);
  };
  
  const handleDeleteTip = async () => {
    try {
      if (deleteId) {
        await deleteTip(deleteId)
        fetchDailyTip()
        console.log("deleteid", deleteId);
        toast.success("Tip deleted succesfully");
      }
    } catch (error: any) {
      toast.error(error.message || "something went wrong");
    }finally{
      setDeleteId("")
    }
  };

  if (loading) {
    return (
      <Loader color="black" isFullScreen={true} message="Fetching tips .." />
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto relative px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Tips List</h1>

        <FormProvider {...methods}>
          <DeleteConfirmation
            description="Are you sure you want to delete this tip?"
            title="Delete Tip"
            onDelete={() => {
              handleDeleteTip();
            }}
            setOpenAlert={setOpenAlert}
            openAlert={openAlert}
            onCancel={() => setDeleteId("")}
          />

          <AddTipModal
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            open={open}
            setIsEdit={setIsEdit}
            setOpen={setOpen}
            isEdit={isEdit}
            setFetchTips={setFetchTips}
            fetchTips={fetchTips}
          ></AddTipModal>

          {tipData && tipData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tipData.map((tip: TipModel, idx) => (
                <TipCard
                  key={idx}
                  onDelete={(id: string) => handleDelete(id)}
                  onEdit={(tip: TipModel, imagePreview: string) =>
                    handleEdit(tip, imagePreview)
                  }
                  tip={tip}
                />
              ))}
            </div>
          ) : (
            <div className="min-h-[70vh] flex items-center justify-center">
              <h2 className="text-lg ">No Tips Found ...</h2>
            </div>
          )}
        </FormProvider>
      </div>
    </div>
  );
}

export default page;
