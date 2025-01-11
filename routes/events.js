/**
 Event routes
 /api/events
*/

// Obtener eventos
import { Router } from "express";

import {
  actualizarEvento,
  eliminarEvento,
  crearEvento,
  getEventos,
} from "../controllers/events.js";

import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  checkEvent,
  checkEventUpdate,
  checkEventDelete,
} from "../validators/events.js";

export const routerEvents = Router();

routerEvents.use(validarJWT);

routerEvents.get("/", getEventos);
routerEvents.post("/", checkEvent, crearEvento);
routerEvents.put("/:id", checkEventUpdate, actualizarEvento);
routerEvents.delete("/:id", checkEventDelete, eliminarEvento);
