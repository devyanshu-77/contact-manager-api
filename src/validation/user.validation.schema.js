import { z } from "zod";

const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must contain atleast 3 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  email: z
    .email({ message: "Invalid email format" })
    .min(3, { message: "Email is too short" })
    .max(254, { message: "Email is too long" }),
  password: z
    .string()
    .min(8, { message: "Password must contain atleast 8 characters" })
    .max(24, { message: "Password must not exceed 24 characters" })
    .refine(
      (val) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
        const res = regex.test(val);
        return res;
      },
      {
        message:
          "Password must contain a number, uppercase, lowercase and a special character",
      },
    ),
});
const signinSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(3, { message: "Email is too short" })
    .max(254, { message: "Email is too long" }),
  password: z
    .string()
    .min(8, { message: "Password must contain atleast 8 characters" })
    .max(24, { message: "Password must not exceed 24 characters" })
    .refine(
      (val) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
        const res = regex.test(val);
        return res;
      },
      {
        message:
          "Password must contain a number, uppercase, lowercase and a special character",
      },
    ),
});

export { signupSchema, signinSchema };
