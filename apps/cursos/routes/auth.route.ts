import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "@/core/middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate(), authController.logout);
router.get('/me', authenticate(), authController.me);

export default router;