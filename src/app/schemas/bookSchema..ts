import { z } from 'zod';

// Define the Zod schema for the book form
export const bookSchema = z.object({
    author: z.string({
        required_error: "Author name is required",
        invalid_type_error: "Author name must be a string"
    })
        .refine((val) => val !== null && val.trim() !== "", {
            message: "Author name cannot be null or empty",
        }),

    title: z.string({
        required_error: "title is required",
        invalid_type_error: "title must be a string"
    }).min(1, "Book title is required"),

    description: z.string({
        required_error: "description is required",
        invalid_type_error: "description must be a string"
    }).min(10, "Description must be at least 10 characters"),
});

// Infer TypeScript type from the Zod schema
export type BookFormData = z.infer<typeof bookSchema>;
