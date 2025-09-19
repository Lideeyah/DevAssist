import { z } from "zod";

export const SignUp = z.object({
  name: z.string().min(2, { error: "Name must be atleast 2 characters long." }),
  email: z.email(),
  password: z.string().min(6, { error: "Password must be atleast 6 characters long." }),
});

export type TSignUp = z.infer<typeof SignUp>;
