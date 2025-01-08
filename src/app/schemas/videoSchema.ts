import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string",
    required_error: "Title is required",
  }).min(1, 'Title is required'),
  
  description: z.string({
    invalid_type_error: "Description must be a string",
    required_error: "Description is required",
  }).min(1, 'Description is required'),

  // Require image file
  image: z
    .custom<FileList>((files) => files instanceof FileList && files.length > 0, {
      message: "Thumbnail image is required",
    }),

  // Require video file
  video: z
    .custom<FileList>((files) => files instanceof FileList && files.length > 0, {
      message: "Video file is required",
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
    message: 'Thumbnail image must be a file and is required',
  }),

  // Validate video file presence
  video: z.custom<File>((file) => {
    if (!(file instanceof File)) {
      return false; // Will trigger an error message if it's not a File object
    }
    return file.size > 0;
  }, {
    message: 'Video file must be a file and is required',
  }),
});

export type VideoFormData = z.infer<typeof videoSchema>;
