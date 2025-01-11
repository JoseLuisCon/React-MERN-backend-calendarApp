import { body, cookie, param } from "express-validator";
import { isDate } from "../helpers/isDate.js";

export const checkEvent = [
  cookie("access_token").exists().withMessage("No hay token en la petición"),
  body("title", "El título es obligatorio y no puede estar vacío")
    .exists()
    .notEmpty(),
  body("start", "La fecha de inicio es obligatorio y tiene que ser una fecha")
    .exists()
    .notEmpty()
    .custom(isDate),
  body("end", "La fecha de inicio es obligatorio y tiene que ser una fecha")
    .exists()
    .notEmpty()
    .custom(isDate),
  [
    body("start", "La fecha de inicio debe ser menor a la fecha final").custom(
      (value, { req }) => {
        if (value > req.body.end) {
          throw new Error("La fecha de inicio debe ser menor a la fecha final");
        }
        return true;
      }
    ),
  ],
];

export const checkEventUpdate = [
  ...checkEvent,
  body("id", "El id del evento es obligatorio").exists(),
];

export const checkEventDelete = [
  cookie("access_token").exists().withMessage("No hay token en la petición"),
  param("id", "El id del evento es obligatorio").exists(),
];
