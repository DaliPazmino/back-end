import User from "../models/User.js";
import bcrypt from "bcryptjs"; // Para encriptar contraseñas
import { validationResult } from "express-validator"; // Para validar datos de entrada

// Crear un nuevo usuario
export async function createUser(req, res) {
  const { nombre, email, password, role } = req.body;

  // Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
      role,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
}

// Actualizar un usuario por su ID
export async function updateUser(req, res) {
  const { id } = req.params;
  const { nombre, email, password, role } = req.body;

  // Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Buscar el usuario por su ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si se proporciona una nueva contraseña, encriptarla
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Actualizar los campos del usuario
    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.role = role || user.role;

    // Guardar los cambios en la base de datos
    await user.save();

    res.status(200).json({ message: "Usuario actualizado exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
}

// Obtener un usuario por su ID
export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
}

// Eliminar un usuario por su ID
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el usuario
    await user.remove();

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
}
