export class AppResponse {
  static success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
