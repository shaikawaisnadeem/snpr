import registerUser from "../controllers/register.controller.js";
import loginUser from "../controllers/login.controller.js";
import express from 'express';
import { getUser } from "../controllers/getuser.controller.js";
import { forgetPassword } from "../controllers/forget.controller.js";
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-user', getUser);
router.post('/forget-password', forgetPassword);
export default router;
//# sourceMappingURL=user.route.js.map