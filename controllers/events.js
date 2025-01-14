import { response } from "express";
import { check, validationResult } from "express-validator";
import { sendResErrorsMiddlewares } from "../helpers/sendErrorsMiddlewares.js";
import { Evento } from "../models/Event.js";
import { configDotenv } from "dotenv";

import pkg from "jsonwebtoken";
import mongoose from "mongoose";

const { verify } = pkg;
configDotenv();

export const getEventos = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResErrorsMiddlewares(res, errors);
  }

  let eventos = [];
  try {
    eventos = await Evento.find().populate("user", "name");

    res.status(200).send({
      ok: true,
      eventos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const crearEvento = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResErrorsMiddlewares(res, errors);
  }

  const { title, notes, start, end } = req.body;

  try {
    const event = new Evento({ title, notes, start, end, user: req.uid });
    const newEvento = await event.save();

    res.status(201).send({
      ok: true,
      evento: newEvento,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const actualizarEvento = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResErrorsMiddlewares(res, errors);
  }

  const eventId = req.params.id;
  if (!eventId) {
    return res.status(400).send({
      ok: false,
      msg: "El id del evento es obligatorio",
    });
  }

  try {
    const event = await Evento.findById(eventId);
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).send({
        ok: false,
        msg: "El id del evento es obligatorio y debe ser un id válido",
      });
    }
    // Comprobamos que la persona que modifica el evento es la misma que la que quiere modificarlo
    const token = req.headers.authorization.split(" ")[1];
    const { uid } = verify(token, process.env.SECRET_JWT_KEY);
    if (event.user.toString() !== uid) {
      return res.status(401).send({
        ok: false,
        msg: "No tiene permisos para editar este evento",
      });
    }

    const newEvent = {
      ...req.body,
      user: event.user,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventId,
      newEvent,
      {
        new: true,
      }
    );

    res.status(200).send({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const eliminarEvento = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResErrorsMiddlewares(res, errors);
  }

  const eventId = req.params.id;
  console.log("🚀 ~ eliminarEvento ~ eventId:", eventId);

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).send({
      ok: false,
      msg: "El id del evento es obligatorio y debe ser un id válido",
    });
  }
  // Comprobamos que la persona que modifica el evento es la misma que la que quiere modificarlo
  const token = req.headers.authorization.split(" ")[1];
  const { uid } = verify(token, process.env.SECRET_JWT_KEY);
  console.log("🚀 ~ eliminarEvento ~ uid:", uid);

  console.log("🚀 ~ eliminarEvento ~ req.uid:", req.uid);
  if (req.uid !== uid) {
    return res.status(401).send({
      ok: false,
      msg: "No tiene permisos para editar este evento",
    });
  }
  try {
    const event = await Evento.findById(eventId);
    if (!event) {
      return res.status(404).send({
        ok: false,
        msg: "Evento no encontrado",
      });
    }
    // Comprobamos que la persona que modifica el evento es la misma que la que quiere modificarlo
    const token = req.headers.authorization.split(" ")[1];
    const { uid } = verify(token, process.env.SECRET_JWT_KEY);
    if (event.user.toString() !== uid) {
      return res.status(401).send({
        ok: false,
        msg: "No tiene permisos para eliminar este evento",
      });
    }

    await Evento.deleteOne({ _id: eventId });

    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
