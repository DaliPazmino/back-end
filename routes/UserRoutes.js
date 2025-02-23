import express from "express";
import {
  createUser,
  updateUser,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Ruta para crear un usuario
router.post("/users", createUser);

// Ruta para actualizar un usuario por su ID
router.put("/users/:id", updateUser);

// Ruta para obtener un usuario por su ID
router.get("/users/:id", getUserById);

// Ruta para eliminar un usuario por su ID
router.delete("/users/:id", deleteUser);

export default router;
