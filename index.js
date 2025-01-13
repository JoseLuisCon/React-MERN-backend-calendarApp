import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { router, routerEvents } from "./routes/index.js";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/configMongo.js";

configDotenv();

// Crear el servidor de express
const app = express();

// Conentando a base de dtos
dbConnection();

// Directorio público
app.use(express.static("public"));
const corsOptions = {
  origin: true,
  credentials: true,
};
// CORS
app.use(cors(corsOptions));

// Lectura y parseo del body
app.use(express.json());

// Utilización de cookies en las peticiones para autenticación
app.use(cookieParser());

// Rutas
// TODO: auth // crear, login, renew
app.use("/api/auth", router);
// TODO: CRUD: Eventos
app.use("/api/events", routerEvents);
//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo por el puerto: ${process.env.PORT}`);
});
