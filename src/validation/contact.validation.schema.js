import { z } from "zod";

const createSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must contain atleast 3 characters" })
    .max(50, { message: "Name length must not exceed 50 characters" }),
  email: z
    .email()
    .min(3, { message: "Email must contain atleast 3 characters" })
    .max(254, { message: "Email length must not exceed 254 characters" }),
  phone: z.e164(),
  company: z
    .string()
    .min(1, { message: "Company name must have 1 character atleast" })
    .max(255, { message: "Company name must not exceed 255 characters" }),
  job_title: z
    .string()
    .min(1, { message: "Job title must have 1 character atleast" })
    .max(255, { message: "Job title must not exceed 255 characters" }),
  tag: z
    .string()
    .min(1, "Tag must have atleast 1 character")
    .max(32, "Tag must not exceed 32 characters"),
});
const searchSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must contain atleast 3 characters" })
      .max(50, { message: "Name length must not exceed 50 characters" }),
    email: z
      .email()
      .min(3, { message: "Email must contain atleast 3 characters" })
      .max(254, { message: "Email length must not exceed 254 characters" }),
    phone: z.e164(),
    tag: z
      .string()
      .min(1, "Tag must have atleast 1 character")
      .max(32, "Tag must not exceed 32 characters"),
  })
  .partial()
  .refine(
    (data) => {
      return Object.values(data).some((val) => val !== undefined);
    },
    { message: "Atleast one field must be provided" },
  );

export { createSchema, searchSchema };
