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
    (files) => files instanceof File && files.size > 0,
    {
      message: "Thumbnail image is required",
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
    (date) => date >= new Date(), // Ensure the date is not in the past
    {
      message: "Back Date is not allowed",
    }
  )
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
    (files) => files instanceof File && files.size > 0,
    {
      message: "Thumbnail image is required",
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
