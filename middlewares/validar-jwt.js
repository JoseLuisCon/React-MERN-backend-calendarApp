import { response, request } from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

const { verify } = jwt;

configDotenv();

export const validarJWT = (req = request, res = response, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid, name } = verify(token, process.env.SECRET_JWT_KEY);
    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};
