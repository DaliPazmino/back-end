import express from "express";
import {
  publicarDepartamento,
  obtenerDepartamentosPorArrendador,
  actualizarDepartamento,
  filtrarDepartamentos,
  obtenerDepartamento,
} from "../controllers/departamentoController.js";
import { authenticate, isArrendador } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/departamento", authenticate, isArrendador, publicarDepartamento);
router.get("/departamentos/arrendador/:id", obtenerDepartamentosPorArrendador);
router.patch("/departamento/:id", actualizarDepartamento);
router.get("/filtrar", filtrarDepartamentos);
router.get("/departamentos/:id", obtenerDepartamento);

export default router;
