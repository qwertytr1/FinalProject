require("dotenv").config();
const express = require("express");
const sequelize = require("../src/config/database");
const apiRoutes = require("../src/routes/api");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require('../src/middleware/error-middleware.js');
const app = express();

app.use(cors({
  origin: 'https://final-project-31fn.vercel.app',
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(errorMiddleware);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.error("Failed to sync database:", err));