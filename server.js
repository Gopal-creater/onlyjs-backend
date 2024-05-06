import app from "./app.js";
import mongoose from "mongoose";
import initilizeAdmin from "./utils/initilizeAdmin.js";

//Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message, err);
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  process.exit(1);
});

const port = process.env.PORT || 3000;
const DB = process.env.DB.replace("<password>", process.env.DB_PWD);

//Connection to mongodb
mongoose.connect(DB).then((con) => {
  console.log("Db connection sucessfull!");
  initilizeAdmin();
});

//Start the server--------
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

//Handle unhandled rejection on promises
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message, err);
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
