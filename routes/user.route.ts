import registerUser from "../controllers/register.controller.ts";
import loginUser from "../controllers/login.controller.ts";
import express from 'express';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;