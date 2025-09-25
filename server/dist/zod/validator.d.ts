import z from 'zod';
export declare const registerObject: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    confirmpassword: z.ZodString;
}, z.z.core.$strip>;
export declare const loginObj: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.z.core.$strip>;
//# sourceMappingURL=validator.d.ts.map