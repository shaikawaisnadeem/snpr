import z from 'zod';

export const registerObject = z.object({
    username: z.string().min(4,{ message: 'username should be atleast 4 characters long'}).max(20, {message: 'username should be atmost 20 characters long'}),
    email: z.email().min(6, {message: 'email should be atleast 6 characters long'}),
    password: z.string().min(8, {message: 'password should be atleast 8 characters long'}).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/ , "password should contain at least one lowercase letter").regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
    confirmpassword: z.string().min(8, {message: 'password should be atleast 8 characters long'}).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/ , "password should contain at least one lowercase letter").regex(/[!@#$%^&*]/, "Password must contain at least one special character")
});

export const loginObj = z.object({
    email: z.email().min(6, {message: 'email should be atleast 6 characters long'}),
    password: z.string().min(8, {message: 'password should be atleast 8 characters long'}).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/ , "password should contain at least one lowercase letter").regex(/[!@#$%^&*]/, "Password must contain at least one special character")
})