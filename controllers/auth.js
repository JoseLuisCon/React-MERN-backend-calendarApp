// Importamos express para recuperar el Intelisense
import { request, response } from "express";
import { validationResult } from "express-validator";
import { configDotenv } from "dotenv";
import bcrypt from "bcryptjs";
import { Usuario } from "../models/Usuario.js";

import { generarJWT } from "../helpers/cookie_access.js";
import { sendResErrorsMiddlewares } from "../helpers/sendErrorsMiddlewares.js";

configDotenv();

const { genSaltSync, hashSync, compareSync } = bcrypt;

export const crearUsuario = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResErrorsMiddlewares(res, errors);
  }
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese correo",
      });
    }
    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = genSaltSync();
    usuario.password = hashSync(password, salt);

    await usuario.save();

    // Generar TOKEN
    const token = await generarJWT(usuario.id, usuario.name);
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token,
      });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el Administrador",
    });
  }
};

export const loginUsuario = async (req = request, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResErrorsMiddlewares(res, errors);
  }

  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }
    //Comprobar password
    const validPassword = compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res
      .status(200)

      .json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token,
      });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Por favor hable con el Administrador",
    });
  }
};

export const revalidarToken = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResErrorsMiddlewares(res, errors);
  }

  try {
    //Generar JWT
    const token = await generarJWT(req.uid, req.name);

    res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};
