import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import globalErrorHandler from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import expressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import userRouter from "./routes/userRoutes.js";
import tutorialRouter from "./routes/tutorialRoutes.js";
import topicRouter from "./routes/topicRoutes.js";
import compression from "compression";

// Loading the env file
dotenv.config({ path: "./config.env" });

//Start the application
const app = express();

//Global Middlewares-------
//Set security  HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again!",
});
app.use("/api", limiter);

//Data sanitization  against NOSQL  query injection
app.use(expressMongoSanitize());

//Data sanitization against xss
app.use(xss());

//preventing parameter pollution
// app.use(
//   hpp({
//     whitelist: ["duration"],
//   })
// );

/* parses the incoming request body containing JSON data This allows you to easily work with the JSON data */
app.use(express.json({ limit: "10kb" }));

//Compression middleware to compress texts
app.use(compression());

//Routes----------
app.get("/", (req, res) => {
  res.send("onlyjs project By Gopal Gautam!");
});

app.use("/api/v1/tutorials", tutorialRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/topics", topicRouter);

//Global Errorn Handler
app.use(globalErrorHandler);

//Handling unhandles request
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `can't find ${req.originalUrl} on this server`,
  });
  next();
});

export default app;
