import { z } from "zod"

export const SignIn = z.object({
   email: z.email(),
   password: z.string().min(6, { error: "Password must be atleast 6 characters long." })
})

export type TSignIn = z.infer<typeof SignIn>