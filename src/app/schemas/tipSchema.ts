import { string, z } from 'zod';

export const tipSchema = z.object({
  _id:z.string().optional(),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
      required_error: "Description is required",
    })
    .min(1, "Description is required"),

    image: z.custom<File>(
      (file) => {
        if (!(file instanceof File)) return false; // Ensure it's a file object
  
        const validExtensions = ["image/jpeg", "image/png", "image/webp","image/jpg", "image/heic"];
        return validExtensions.includes(file.type); // Check MIME type
      },
      {
        message: "Only valid image files (JPEG, PNG,JPG, WEBP) are allowed.",
      }
    ),

  date: z
  .union([z.string(), z.date()])
  .transform((value) => (typeof value === "string" ? new Date(value) : value))
  .refine(
    (date) => !isNaN(date.getTime()), // Check if date is valid
    {
      message: "Date is required and must be valid",
    }
  )
  .refine(
    (date) => {
      const today = new Date();
      // Clear the time portion of both dates for a pure date comparison
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today; // Return true if the selected date is today or in the future
    },
    {
      message: "Back Date is not allowed",
    }
  ),
});


export const ediTipSchema = z.object({
  _id: z.string({ required_error: "tip id is required" }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
      required_error: "Description is required",
    })
    .min(1, "Description is required"),

    image: z.custom<File>(
      (file) => {
        if (!(file instanceof File)) return false; // Ensure it's a file object
  
        const validExtensions = ["image/jpeg", "image/png", "image/webp","image/jpg", "image/heic"];
        return validExtensions.includes(file.type); // Check MIME type
      },
      {
        message: "Only valid image files (JPEG, PNG, JPG, WEBP) are allowed.",
      }
    ).optional(),

  date: z
    .union([z.string(), z.date()])
    .transform((value) => (typeof value === 'string' ? new Date(value) : value))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Date is required and must be valid",
    }),
});


export const initialDefaultValues = {
  description: "",
  date: new Date(),
  _id: "",
};

export type tipFormData = z.infer<typeof tipSchema>;
