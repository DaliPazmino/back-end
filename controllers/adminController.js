import Departament from "../models/Departament.js";
import User from "../models/User.js";

// Controlador para aprobar un departamento
export async function aprobarDepartamento(req, res) {
  try {
    // Verificar que el usuario tiene el rol de administrador
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message:
          "Acción no permitida. Solo administradores pueden aprobar departamentos.",
      });
    }

    const { id } = req.params; // ID del departamento a aprobar

    // Buscar el departamento en la base de datos
    const departamento = await Departament.findById(id);

    if (!departamento) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Actualizar el estado de aprobado a true
    departamento.aprobado = true;

    // Guardar los cambios
    await departamento.save();

    res
      .status(200)
      .json({ message: "Departamento aprobado correctamente", departamento });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al aprobar el departamento", error });

    console.log(error);
  }
}

// Controlador para desaprobar un departamento
export async function desaprobarDepartamento(req, res) {
  try {
    // Verificar que el usuario tiene el rol de administrador
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message:
          "Acción no permitida. Solo administradores pueden desaprobar departamentos.",
      });
    }

    const { id } = req.params; // ID del departamento a desaprobar

    // Buscar el departamento en la base de datos
    const departamento = await Departament.findById(id);

    if (!departamento) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Actualizar el estado de aprobado a false
    departamento.aprobado = false;

    // Guardar los cambios
    await departamento.save();

    res.status(200).json({
      message: "Departamento desaprobado correctamente",
      departamento,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desaprobar el departamento", error });
  }
}

// Obtener todos los arrendadores no verificados
export async function obtenerArrendadoresPendientes(req, res) {
  try {
    const arrendadores = await User.find({
      role: "arrendador",
    });
    res.status(200).json(arrendadores);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los arrendadores", error });
    console.log(error);
  }
}

// Aprobar arrendador
export async function aprobarArrendador(req, res) {
  try {
    const { id } = req.params;
    const arrendador = await User.findByIdAndUpdate(
      id,
      { verificado: true },
      { new: true }
    );

    if (!arrendador) {
      return res.status(404).json({ message: "Arrendador no encontrado" });
    }

    res.status(200).json({ message: "Arrendador aprobado", arrendador });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al aprobar el arrendador", error });
  }
}

// Desactivar cuenta de arrendador
export async function desactivarArrendador(req, res) {
  try {
    const { id } = req.params;
    const arrendador = await User.findById(id);

    arrendador.verificado = false;

    if (!arrendador) {
      return res.status(404).json({ message: "Arrendador no encontrado" });
    }

    res.status(200).json({ message: "Arrendador eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el arrendador", error });
  }
}
