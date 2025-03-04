import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller, useFormContext } from "react-hook-form";
import {
  initialDefaultValues,
  tipFormData,
  tipSchema,
} from "@/app/schemas/tipSchema";
import { addTip, editTip } from "@/app/appApi/Tip";
import toast from "react-hot-toast";
import Loader from "../global/loader";

type AddTipModalProps = {
  setFetchTips: any;
  fetchTips: any;
  isEdit: boolean;
  open: boolean;
  setOpen: any;
  setIsEdit: any;
  setImagePreview: any;
  imagePreview: any;
};

const AddTipModal: React.FC<AddTipModalProps> = ({
  setImagePreview,
  imagePreview,
  fetchTips,
  setFetchTips,
  isEdit,
  open,
  setOpen,
  setIsEdit,
}) => {
  const {
    formState: { errors },
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
  } = useFormContext();

  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // console.log("errors", errors);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("description", e.target.value);
  };

  const handleDateChange = (date: Date | null) => {
    setValue("date", date || new Date()); // Fallback to the current date if `null`
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("image", e.target.files[0]);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const resetForm = () => {
    reset(initialDefaultValues);
    setIsEdit(false);
    setOpen(false);
    setImagePreview(null);
  };
  const onSubmit = async () => {
    try {
      const formData = getValues();
      if (formData?.image) {
        setIsLoadingApi(true);
      }
      console.log("Form Data Submitted changes: ", formData);

      if (isEdit) {
        await editTip(formData);
      } else {
        await addTip(formData);
      }

      setIsLoadingApi(false);

      setFetchTips(!fetchTips);

      reset();

      toast.success(`Tip ${isEdit ? "edited" : "added"} successfully`);
      setIsEdit(false);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "something went wrong");
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <div>
      {/* Trigger to Open Modal */}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            resetForm(); // Reset form when dialog is closed
          }
        }}
      >
        <DialogTrigger asChild className="absolute right-6 top-0 ">
          <Button
            onClick={() => {
              resetForm();
            }}
          >
            Add Tip
          </Button>
        </DialogTrigger>
        <DialogContent className="mt-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Tip" : "Add New Tip"}</DialogTitle>
          </DialogHeader>

          {isLoadingApi ? (
            <div className="space-y-4">
              <Loader color="black" message="saving changes..." />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label htmlFor="image">Upload Image</Label>

                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <Input
                      // id="image"
                      // name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  )}
                ></Controller>
                {/* {isEdit && !imagePreview && (
                  <div className="mt-2">
                    <img
                      src={
                        "https://png.pngtree.com/png-vector/20220305/ourmid/pngtree-quick-tips-vector-ilustration-in-flat-style-png-image_4479926.png"
                      }
                      alt="Preview"
                      className="w-full h-auto max-h-48 object-contain border rounded-md"
                    />
                  </div>
                )} */}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto max-h-48 object-contain border rounded-md"
                    />
                  </div>
                )}
                
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message as any}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>

                <Controller
                  control={control}
                  name="description"
                  defaultValue={""}
                  render={({ field }) => (
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter a description"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={field.value}
                      onChange={handleChange}
                      // required
                    />
                  )}
                ></Controller>

                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.description?.message as any}
                  </p>
                )}
              </div>

              {/* Date Picker */}
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Controller
                  control={control}
                  name="date"
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <DatePicker
                      id="date"
                      minDate={new Date()}
                      selected={field.value ?? new Date()}
                      onChange={(date: Date | null) => handleDateChange(date)} // Updated to accept Date | null
                      dateFormat="yyyy-MM-dd"
                      className="w-full p-2 border rounded-md"
                    />
                  )}
                ></Controller>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message as any}
                  </p>
                )}
              </div>

              {/* Footer Buttons */}
              <DialogFooter>
                <Button type="submit">Save</Button>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()} variant="outline">
                    Cancel
                  </Button>
                </DialogTrigger>
              </DialogFooter>
            </form>
          )}
          {/* Form */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTipModal;
