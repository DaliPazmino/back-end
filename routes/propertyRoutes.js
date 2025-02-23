import express from "express";
import {
  publicarDepartamento,
  obtenerDepartamentosPorArrendador,
  actualizarDepartamento,
  obtenerDepartamentosDisponibles,
  filtrarDepartamentos,
} from "../controllers/departamentoController.js";
import { authenticate, isArrendador } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para publicar un departamento (solo para arrendadores autenticados)
router.post("/publicarDep", authenticate, isArrendador, publicarDepartamento);

// Ruta para obtener departamentos de un arrendador
router.get("/arrendador/:id", obtenerDepartamentosPorArrendador);
router.patch("/actualizarDep/:id", actualizarDepartamento);
router.get("/departamentosArrendador", obtenerDepartamentosDisponibles);
router.get("/filtrar", filtrarDepartamentos);

export default router;
