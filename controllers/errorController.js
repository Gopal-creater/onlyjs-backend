import AppError from "../utils/appError.js";

const handleJsonWebTokenError = (err) => {
  const message = "Invalid token, please log in again!";
  return new AppError(message, 401);
};

const handleTokenExpiredError = (err) => {
  const message = "Your token has expired, please log in again!";
  return new AppError(message, 401);
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const message = `Duplicate field value ${Object.keys(
    err.keyValue
  )}, please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Log the error
    console.log("Error :: ", err);

    //Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "CastError") error = handleCastError(error);
    if (err.code === 11000) error = handleDuplicateFields(error);
    if (err.name === "ValidationError") error = handleValidationError(error);
    if (err.name === "JsonWebTokenError")
      error = handleJsonWebTokenError(error);
    if (err.name === "TokenExpiredError")
      error = handleTokenExpiredError(error);
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
