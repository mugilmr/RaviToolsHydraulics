import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(2, "Name is too short").max(200),
  description: z.string().min(1, "Add a short description").max(2000),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Choose a category"),
  imageUrl: z.string().optional().nullable(),
  inStock: z.coerce.boolean().optional().default(true),
  published: z.coerce.boolean().optional().default(true),
});

export const categoryInputSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional(),
  imageUrl: z.string().optional().nullable(),
});

export const orderInputSchema = z.object({
  customerName: z.string().min(2, "Enter your name"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15),
  address: z.string().min(5, "Enter a delivery address"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        qty: z.number().int().positive(),
      }),
    )
    .min(1, "Your cart is empty"),
  mode: z.enum(["checkout", "request-call"]),
  notes: z.string().optional(),
});

export const enquiryInputSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  message: z.string().min(5, "Tell us a bit more"),
});

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
