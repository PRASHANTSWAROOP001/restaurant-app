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


export const staffEditSchema = z.object({
    name:z.string().min(3, "name cant be less than 3 letters"),
    email:z.email("provide valid email"),
    password:z.string().min(6, "password length > 6").optional(),
    status:z.enum(["ACTIVE", "INACTIVE","TERMINATED"]),
    position:z.string(),
})

export const menuItemSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    category: z.string().min(1, "Category is required"),
    basePrice:z.number(),
    sellPrice:z.number(),
    label:z.enum(["SPECIAL", "NEW", "POPULAR", "RECOMMENDED","MOST_ORDERED", "BEST_VALUE" ]).optional(),
    imageUrl:z.string(),
    discounted:z.boolean().default(false),
    categoryId:z.string().optional()
})