import Departament from "../models/Departament.js";

export async function obtenerDepartamentos(req, res) {
  try {
    // Obtener solo los departamentos que estén disponibles y aprobados
    const departamentos = await Departament.find({
      disponible: true, // Filtro para departamentos disponibles
      aprobado: true, // Filtro para departamentos aprobados
    });

    // Enviar la respuesta con los departamentos filtrados
    res.status(200).json(departamentos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los departamentos", error });
    console.log(error);
  }
}
