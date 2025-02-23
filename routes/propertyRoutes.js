import express from "express";
import {
  publicarDepartamento,
  obtenerDepartamentosPorArrendador,
} from "../controllers/departamentoController.js";
import { authenticate, isArrendador } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para publicar un departamento (solo para arrendadores autenticados)
router.post("/publicarDep", authenticate, isArrendador, publicarDepartamento);

// Ruta para obtener departamentos de un arrendador
router.get("/arrendador/:id", obtenerDepartamentosPorArrendador);

export default router;
