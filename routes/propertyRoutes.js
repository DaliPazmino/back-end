// routes/departamentoRoutes.js
import { Router } from "express";
import { publicarDepartamento } from "../controllers/departamentoController.js";

const router = Router();

router.post("/departament", publicarDepartamento);

export default router;
