const verificarArrendador = (req, res, next) => {
  if (req.user.rol !== "arrendador") {
    return res
      .status(403)
      .json({ mensaje: "Solo los arrendadores pueden gestionar viviendas" });
  }
  next();
};

export default verificarArrendador;
