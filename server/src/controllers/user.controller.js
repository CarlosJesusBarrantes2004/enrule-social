import EmailVerificationModel from '../models/EmailVerification.js';
import UserModel from '../models/User.js';
import PasswordResetModel from '../models/PasswordReset.js';
import { compareString, hashString } from '../utils/hashstring.js';
import { sendResetPassword } from '../utils/sendemail.js';
import { generateToken } from '../utils/jwt.js';
import FriendRequestModel from '../models/FriendRequest.js';
import { sendResponse } from '../utils/sendResponse.js';
import { uploadImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

export const verifyEmail = async (req, res, next) => {
  const { id, token } = req.params;

  try {
    const result = await EmailVerificationModel.findOne({ userId: id });

    if (result) {
      const { expiresAt, token: savedToken } = result;

      //Token has expires
      if (expiresAt < Date.now()) {
        await EmailVerificationModel.findOneAndDelete({ userId: id });
        await UserModel.findOneAndDelete({ _id: id });
        const message = 'Verification token has expired.';
        return res.redirect(
          `/users/email/verify-page?status=error&message=${message}`
        );
      }

      const isMatch = await compareString(token, savedToken);

      //Token is valid
      if (isMatch) {
        await UserModel.findOneAndUpdate({ _id: id }, { verified: true });
        await EmailVerificationModel.findOneAndDelete({ userId: id });
        const message = 'Email verified successfully';
        return res.redirect(
          `/users/email/verify-page?status=success&message=${message}`
        );
      } else {
        const message = 'Verification failed or link is invalid';
        return res.redirect(
          `/users/email/verify-page?status=error&message=${message}`
        );
      }
    } else {
      const message = 'Invalid verification link. Try again later.';
      res.redirect(`/users/email/verify-page?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    return res.redirect(
      '/users/email/verify-page?status=error&message=Something went wrong'
    );
  }
};

export const requestResetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      const error = new Error('Email address not found');
      error.status = 404;
      error.code = 'EMAIL_NOT_FOUND';
      return next(error);
    }

    const existingRequest = await PasswordResetModel.findOne({
      email,
    });

    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        sendResponse(res, {
          status: 201,
          message: 'Reset password link has already been sent to your email.',
          warnings: [
            {
              code: 'RESET_PASSWORD_ALREADY_SENT',
              details: 'Reset password is pending',
            },
          ],
        });
        return;
      }
      await PasswordResetModel.findOneAndDelete({ email });
    }

    await sendResetPassword(user, res, next);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { id, token } = req.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      const message = 'Invalid password reset link. Try again later.';
      return res.redirect(
        `/users/password/reset-page?status=error&message=${message}`
      );
    }

    const resetPassword = await PasswordResetModel.findOne({ userId: id });

    if (!resetPassword) {
      const message = 'Invalid password reset link. Try again later.';
      res.redirect(
        `/users/password/reset-page?status=error&message=${message}`
      );
    }

    const { expiresAt, token: savedToken } = resetPassword;

    //Token has expired
    if (expiresAt < Date.now()) {
      await PasswordResetModel.findOneAndDelete({ userId: id });
      const message = 'Password reset link has expired. Try again.';
      res.redirect(
        `/users/password/reset-page?status=error&message=${message}`
      );
    } else {
      const isMatch = await compareString(token, savedToken);
      //Token is valid
      if (!isMatch) {
        const message = 'Invalid password reset link. Try again later.';
        res.redirect(
          `/users/password/reset-page?status=error&message=${message}`
        );
      } else {
        res.redirect(`/users/password/reset-page?type=reset&id=${id}`);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { id, password } = req.body;

  try {
    const hashedPassword = await hashString(password);
    const user = await UserModel.findByIdAndUpdate(
      { _id: id },
      { password: hashedPassword }
    );

    if (user) {
      await PasswordResetModel.findOneAndDelete({ userId: id });
      res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params; //ID of another user
  const { userId } = req.body; //ID of current user

  try {
    const user = await UserModel.findById(id ?? userId).populate({
      path: 'friends',
      select: '-password',
    });
    user.password = undefined;

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    sendResponse(res, { message: 'User retrieved successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { userId, firstName, lastName, location, profession } = req.body;

  try {
    const user = await UserModel.findById(userId);

    let photo = user.photo;

    if (req.files && req.files.file) {
      const response = await uploadImage(req.files.file.tempFilePath, 'photos');
      await fs.remove(req.files.file.tempFilePath);
      photo = {
        url: response.secure_url,
        public_id: response.public_id,
      };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        location,
        photo,
        profession,
      },
      { new: true }
    );

    await updatedUser.populate({
      path: 'friends',
      select: '-password',
    });
    const token = generateToken({ id: user._id }, '1d');

    sendResponse(res, {
      message: 'User updated successfully',
      data: { token, user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const friendRequest = async (req, res, next) => {
  const { userId } = req.body;
  const { requestTo } = req.body;

  try {
    const requestExist = await FriendRequestModel.findOne({
      requestFrom: userId,
      requestTo,
    });

    const accountExist = await FriendRequestModel.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });

    if (requestExist || accountExist) {
      const error = new Error('Friend request already sent');
      error.status = 400;
      error.code = 'FRIEND_REQUEST_ALREADY_SENT';
      return next(error);
    }

    await FriendRequestModel.create({
      requestFrom: userId,
      requestTo,
    });

    sendResponse(res, { message: 'Request sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFriendRequests = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const friendRequest = await FriendRequestModel.find({
      requestTo: userId,
      status: 'pending',
    })
      .populate({
        path: 'requestFrom',
        select: '_id firstName lastName photo profession -password',
      })
      .limit(10)
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      data: friendRequest,
      message: 'Friend request retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req, res, next) => {
  const { userId, requestId, status } = req.body;

  try {
    const requestExist = await FriendRequestModel.findById(requestId);

    if (!requestExist) {
      const error = new Error('Friend request not found');
      error.status = 404;
      error.code = 'FRIEND_REQUEST_NOT_FOUND';
      return next(error);
    }

    const newRes = await FriendRequestModel.findByIdAndUpdate(
      { _id: requestId },
      { status }
    );

    if (status === 'accepted') {
      const user = await UserModel.findById(userId);

      user.friends.push(newRes.requestFrom);

      await user.save();

      const friend = await UserModel.findById(newRes.requestFrom);

      friend.friends.push(newRes.requestTo);

      await friend.save();
    }

    sendResponse(res, { message: 'Friend request ' + status });
  } catch (error) {
    next(error);
  }
};

export const profileView = async (req, res, next) => {
  const { id, userId } = req.body;

  try {
    const user = await UserModel.findById(id);

    user.views.push(userId);

    await user.save();

    sendResponse(res, { message: 'Profile viewed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSuggestedFriends = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const queryObject = {};

    queryObject._id = { $ne: userId };
    queryObject.friends = { $nin: userId };

    const queryResult = UserModel.find(queryObject)
      .limit(15)
      .select('_id firstName lastName photo profession -password');

    const suggestedFriends = await queryResult;

    sendResponse(res, {
      message: 'Suggested friends retrieved successfully',
      data: suggestedFriends,
    });
  } catch (error) {
    next(error);
  }
};
