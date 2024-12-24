import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

export const userAuth = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader & !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authentication failed');
    error.status = 401;
    error.code = 'AUTH_HEADER_MISSING';
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    const error = new Error('Authentication failed');
    error.status = 401;
    error.code = 'AUTH_TOKEN_MISSING';
    return next(error);
  }

  try {
    const decoded = JWT.verify(token, JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};
