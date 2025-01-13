import { body, cookie } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";

export const registerValidator = [
  body("name", "El nombre es obligatorio").notEmpty(),
  body("email", "Debe de enviar un email").not().isEmpty(),
  body("email", "Email Inválido").isEmail(),
  body("password", "Número de caracteres mínimo de la contraseña: 6").isLength({
    min: 6,
  }),
];
export const loginValidator = [
  body("email", "Debe de enviar un email").not().isEmpty(),
  body("email", "Email Inválido").isEmail(),
  body("password", "Número de caracteres mínimo de la contraseña: 6").isLength({
    min: 6,
  }),
];
export const renovarTokenValidator = [validarJWT];
