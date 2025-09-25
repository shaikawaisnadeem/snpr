import registerUser from "../controllers/register.controller.ts";
import loginUser from "../controllers/login.controller.ts";
import express from 'express';
import { getUser } from "../controllers/getuser.controller.ts";
import { forgetPassword } from "../controllers/forget.controller.ts";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-user',getUser);
router.post('/forget-password', forgetPassword)

export default router;