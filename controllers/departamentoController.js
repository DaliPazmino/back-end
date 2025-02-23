// controllers/departamentoController.js
import multer from "multer";
import Departament from "../models/Departament.js";
// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("fotos", 5); // Permitir hasta 5 fotos

export function publicarDepartamento(req, res) {
  // Verifica si hay archivos subidos
  /*   if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No se subieron archivos" });
  } */

  const { titulo, descripcion, precio, caracteristicas, condiciones } =
    req.body;

  //   const fotos = req.files.map((file) => file.path); // Obtener las rutas de los archivos

  const nuevoDepartamento = new Departament({
    titulo,
    descripcion,
    precio,
    caracteristicas,
    condiciones,
  });

  nuevoDepartamento
    .save()
    .then((departamento) => res.status(201).json(departamento))
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Error al guardar el departamento", error })
    );
}
