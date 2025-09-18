{/** 
import mysql from "mysql2";

// Conexión local sin variables de entorno y sin SSL
const db = mysql.createConnection({
  host: "localhost",       // tu host local, normalmente localhost
  port: 3306,              // puerto MySQL por defecto
  user: "root",            // usuario local de MySQL
  password: "A1234L", // tu contraseña local
  database: "blog", // nombre de tu base de datos local

});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL local");
});

export default db;
*/}
 /* "proxy": "http://localhost:8800/api"*/


  
  
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
  
  