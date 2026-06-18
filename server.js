require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const PORT = process.env.PORT || 4000;

const startServer = () => {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log("server is running on port", PORT);
      });
    })
    .catch((err) => {
      console.log("error while running the server", err);
    });
};

startServer();
