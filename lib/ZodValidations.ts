import z from 'zod';


export const zodSignupSchema = z.object({
    email:z.email("Invalid email address").nonempty("Email is required"),
    password:z.string().min(6, "Password must be at least 6 characters"),
    name:z.string().min(3, "cant be smaller than 3 letters").optional()
})