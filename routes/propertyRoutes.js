import express from "express";
import upload, {
  publicarDepartamento,
  obtenerDepartamentosPorArrendador,
  actualizarDepartamento,
  filtrarDepartamentos,
  obtenerDepartamento,
} from "../controllers/departamentoController.js";
import { authenticate, isArrendador } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/departamento",
  authenticate,
  isArrendador,
  upload,
  publicarDepartamento
);
router.get("/departamentos/arrendador/:id", obtenerDepartamentosPorArrendador);
router.patch(
  "/departamento/:id",
  authenticate,
  isArrendador,
  upload,
  actualizarDepartamento
);
router.get("/filtrar", filtrarDepartamentos);
router.get("/departamentos/:id", obtenerDepartamento);

export default router;
