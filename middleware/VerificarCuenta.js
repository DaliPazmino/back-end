const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }
    next();
  };
};

export default verificarRol;
