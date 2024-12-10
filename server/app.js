require("dotenv").config();
const express = require("express");
const sequelize = require("./src/config/database");
const apiRoutes = require("./src/routes/api");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const errorMiddleware = require('./src/middleware/error-middleware.js');
// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api", apiRoutes);
app.use(errorMiddleware);
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
