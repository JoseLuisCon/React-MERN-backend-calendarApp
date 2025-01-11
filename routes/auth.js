/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

import { Router } from "express";

import {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} from "../controllers/auth.js";
import {
  registerValidator,
  loginValidator,
  renovarTokenValidator,
} from "../validators/index.js";

export const router = Router();

router.post("/new", registerValidator, crearUsuario);
router.post("/", loginValidator, loginUsuario);
router.get("/renew", renovarTokenValidator, revalidarToken);
