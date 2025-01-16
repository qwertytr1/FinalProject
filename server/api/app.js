require("dotenv").config();
const express = require("express");
const sequelize = require("../src/config/database");
const apiRoutes = require("../src/routes/api");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require('../src/middleware/error-middleware.js');
const app = express();

app.use(cors({
  origin: 'https://final-project-4v8o.vercel.app',
//  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(errorMiddleware);

console.log("Starting the server...");
export default (req, res) => {
  sequelize
    .sync({ force: false })
    .then(() => {
      app(req, res);
    })
    .catch((err) => {
      console.error("Failed to sync database:", err);
      res.status(500).json({ error: 'Failed to sync database' });
    });
}