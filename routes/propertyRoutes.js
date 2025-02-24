import express from "express";
import {
  publicarDepartamento,
  obtenerDepartamentosPorArrendador,
  actualizarDepartamento,
  obtenerDepartamentosDisponibles,
  filtrarDepartamentos,
  obtenerDepartamento,
} from "../controllers/departamentoController.js";
import { authenticate, isArrendador } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para publicar un departamento (solo para arrendadores autenticados)
router.post("/departamentos", authenticate, isArrendador, publicarDepartamento);

// Ruta para obtener departamentos de un arrendador
router.get("/arrendador/:id", obtenerDepartamentosPorArrendador);
router.patch("/actualizarDep/:id", actualizarDepartamento);
router.get(
  "/departamentosArrendador",
  authenticate,
  obtenerDepartamentosDisponibles
);
router.get("/filtrar", filtrarDepartamentos);

router.get("/api/departamentos/:id", obtenerDepartamento);

export default router;
