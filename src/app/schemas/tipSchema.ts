import { z } from 'zod';

export const tipSchema = z.object({
  description: z
    .string({
      invalid_type_error: "Description must be a string",
      required_error: "Description is required",
    })
    .min(1, "Description is required"),

  image: z.custom<FileList>(
    (files) => files instanceof FileList && files.length > 0,
    {
      message: "Thumbnail image is required",
    }
  ),

  date: z
    .date({
      invalid_type_error: "Date must be a valid date",
      required_error: "Date is required",
    })
    .refine((date) => !isNaN(date.getTime()), {
      message: "Date is required and must be valid",
    }),
});


export const validationVideoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),

  image: z.custom<File>((file) => {
    if (!(file instanceof File)) {
      return false; // Will trigger an error message if it's not a File object
    }
    return file.size > 0; // Ensure the file has content (size > 0)
  }, {
    message: 'image must be a file and is required',
  }),

});

export type tipFormData = z.infer<typeof tipSchema>;
