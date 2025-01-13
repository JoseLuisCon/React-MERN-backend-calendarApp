import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

export const generarJWT = (uid, name) => {
  //Generar JWT
  return new Promise((resolve, reject) => {
    jwt.sign(
      { uid, name },
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.log(err);

          reject("No se pudo generar el token");
        }
        resolve(token);
      }
    );
  });
};
