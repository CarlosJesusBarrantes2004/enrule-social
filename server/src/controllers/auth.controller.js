import User from '../models/User.js';
import { compareString, hashString } from '../utils/hashstring.js';
import { generateToken } from '../utils/jwt.js';
import { sendVerificationEmail } from '../utils/sendemail.js';
import { sendResponse } from '../utils/sendResponse.js';

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const error = new Error('User already exists');
      error.status = 409;
      error.code = 'USER_ALREADY_EXISTS';
      return next(error);
    }

    const passwordHash = await hashString(password);

    const userDoc = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await sendVerificationEmail(userDoc, res, next);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password').populate({
      path: 'friends',
      select: '_id firstName lastName photo profession -password',
    });

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    if (!user?.verified) {
      const error = new Error(
        'User email is not verified. Check your email account and verify your email'
      );
      error.status = 401;
      error.code = 'USER_EMAIL_NOT_VERIFIED';
      return next(error);
    }

    const isMatch = await compareString(password, user.password);

    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      error.code = 'INVALID_EMAIL_OR_PASSWORD';
      return next(error);
    }

    user.password = undefined;

    const token = generateToken({ id: user._id }, '1d');

    sendResponse(res, {
      message: 'User signed in successfully',
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};
