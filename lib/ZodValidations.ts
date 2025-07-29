import z from 'zod';


export const zodSignupSchema = z.object({
    email:z.email("Invalid email address").nonempty("Email is required"),
    password:z.string().min(6, "Password must be at least 6 characters"),
    name:z.string().min(3, "cant be smaller than 3 letters").optional()
})


export const staffOnboardingSchema = z.object({
    name:z.string().min(3, "name cant be less than 3 letters"),
    email:z.email("provide valid email"),
    password:z.string().min(6, "password length > 6"),
    position:z.string().min(2,"postion cant be lesser than 2 letters")
})