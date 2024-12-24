export const sendResponse = (
  res,
  { status = 200, message, data = null, warnings = null }
) => {
  const response = {
    success: true,
    status,
    message,
    data,
    warnings,
    error: null,
  };
  res.status(status).json(response);
};

export const sendErrorResponse = (
  next,
  { status = null, message = null, code = null, details = null }
) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.details = details;
  next(error);
};
