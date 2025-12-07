import { Router } from "express";
import { getPerfil } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/perfil", verifyToken, getPerfil);

export default router;
