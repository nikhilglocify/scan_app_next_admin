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
import { useForm, Controller } from "react-hook-form";
import { tipFormData, tipSchema } from "@/app/schemas/tipSchema";
import { addTip } from "@/app/appApi/Tip";
import toast from "react-hot-toast";

type AddTipModalProps ={
  setFetchTips:any,
  fetchTips:any



}

const AddTipModal :React.FC<AddTipModalProps> = ({fetchTips,setFetchTips}) => {
  const [open, setOpen] = useState(false);
  const {
    formState: { errors },
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
  } = useForm<tipFormData>({
    resolver: zodResolver(tipSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  console.log("errors", errors);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("description", e.target.value);
  };

  const handleDateChange = (date: Date) => {
    setValue("date", date);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("image", e.target.files[0]);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit =async () => {
    try {
      const formData = getValues();
      console.log("Form Data Submitted: ", formData);
      await addTip(formData);
      setFetchTips(!fetchTips)
      setOpen(false)
      // reset();

      toast.success("Tip added successfully");
    } catch (error: any) {
      toast.error(error.message || "something went wrong");
    }
  };

  return (
    <div>
      {/* Trigger to Open Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Tip</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tip</DialogTitle>
          </DialogHeader>

          {/* Form */}
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

              {/* Image Preview */}
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
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>

              <Controller
                control={control}
                name="description"
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
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Date Picker */}
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    id="date"
                    selected={field.value ?? new Date()}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-2 border rounded-md"
                  />
                )}
              ></Controller>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Footer Buttons */}
            <DialogFooter>
              <Button type="submit">Submit</Button>
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTipModal;
