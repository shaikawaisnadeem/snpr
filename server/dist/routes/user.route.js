import express from "express";
import registerUser from "../controllers/register.controller.js";
import loginUser from "../controllers/login.controller.js";
import { getUser } from "../controllers/getuser.controller.js";
import { forgetPassword, requestPasswordReset } from "../controllers/forget.controller.js";
import { authMiddleware } from "../middleware/get.middleware.js";
const router = express.Router();
// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", requestPasswordReset);
// Protected routes
router.get("/get-user", authMiddleware, getUser);
export default router;
//# sourceMappingURL=user.route.js.map