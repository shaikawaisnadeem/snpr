import type { Request, Response } from "express";
/**
 * Step 1: Request Password Reset
 */
export declare const forgetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Step 2: Reset Password
 */
export declare const requestPasswordReset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=forget.controller.d.ts.map