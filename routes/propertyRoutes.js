// routes/departamentoRoutes.js
import { Router } from "express";
import upload, {
  obtenerDepartamentosPorArrendador,
  publicarDepartamento,
} from "../controllers/departamentoController.js";

const router = Router();

router.post("/departament", upload, publicarDepartamento);
router.get("/arrendador/:id", obtenerDepartamentosPorArrendador);

export default router;
