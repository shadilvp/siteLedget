const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};

export default errorHandler;
