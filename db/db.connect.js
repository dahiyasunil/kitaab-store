const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Database connected successfully."))
    .catch((err) =>
      console.log(
        "An error occured while trying to connect to database.\nError:\n",
        err
      )
    );
};

module.exports = { initializeDatabase };
