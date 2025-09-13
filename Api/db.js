
import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();


const certPath = path.resolve("c/ca-from-env.pem");

// Crear archivo con certificado decodificado base64
const decodedCert = Buffer.from(process.env.DB_SSL_CERT, "base64").toString("utf-8");
fs.writeFileSync(certPath, decodedCert);

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(certPath),
    rejectUnauthorized: true,
  },
});



db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

{/**import mysql from "mysql";  // Importa el paquete mysql para conectar con la base de datos
import dotenv from "dotenv";

dotenv.config();

// Crea y exporta la conexión a la base de datos MySQL con los datos de configuración
export const db = mysql.createConnection({
  host: process.env.DB_HOST,           // Dirección del servidor de base de datos
  port: Number(process.env.DB_PORT),   // Puerto proporcionado por Aiven (asegúrate que esté en .env)
  user: process.env.DB_USER,           // Usuario para conectar a la base de datos
  password: process.env.DB_PASSWORD,   // Contraseña del usuario
  database: process.env.DB_NAME,       // Nombre de la base de datos a usar
  ssl: {
    rejectUnauthorized: true           // Para validar el certificado SSL
  }
}); */}