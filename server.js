const express = require("express");
const { Client } = require("pg");

const app = express();
const port = 3000;

async function connectWithRetry() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "postgres"    
  });

  try {
    await client.connect();
    console.log("✅ Conectado a PostgreSQL");

    app.get("/", async (req, res) => {
      try {
        const result = await client.query("SELECT * FROM users");
        res.json(result.rows);
      } catch (err) {
        res.status(500).send("Error en la consulta");
      }
    });

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });

  } catch (err) {
    console.error("⏳ PostgreSQL no está listo, reintentando en 5s...", err.message);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();
