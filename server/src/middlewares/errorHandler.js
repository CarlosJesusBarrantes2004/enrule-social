import { ZodError } from 'zod';

const errorHandler = (err, req, res, next) => {
  const response = {
    success: false,
    status: err.status || 500,
    message: err.message || 'Internal server error',
    data: null,
    warnings: null,
    error: {
      code: err.code || 'ERROR_UNKNOWN',
      details: err.details || null,
    },
  };

  if (err instanceof ZodError) {
    response.status = 400;
    response.message = 'Validation error';
    response.error.code = 'VALIDATION_ERROR';
    response.error.details = err.errors.map((e) => e.message).join(', ');
  }

  if (err?.name === 'ValidationError') {
    response.status = 400;
    response.message = 'Validation error';
    response.error.code = 'VALIDATION_ERROR';
    response.error.details = Object.values(err.errors).join(', ');
  }

  res.status(response.status).json(response);
};

export default errorHandler;
