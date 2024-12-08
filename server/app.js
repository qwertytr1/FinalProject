require("dotenv").config();
const express = require("express");
const sequelize = require("./src/config/database");
const apiRoutes = require("./src/routes/api");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", apiRoutes);

// Sync DB and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.error("Failed to sync database:", err));
