import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } from '../config/config.js';
import { hashString } from './hashstring.js';
import EmailVerificationModel from '../models/EmailVerification.js';
import PasswordResetModel from '../models/PasswordReset.js';
import { sendResponse } from './sendResponse.js';

let transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendVerificationEmail = async (user, res, next) => {
  const { _id, email, lastName } = user;
  const token = _id + uuidv4();
  const link = APP_URL + 'users/email/verify/' + _id + '/' + token;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `<div
    style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
    <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
    <hr>
    <h4>Hi ${lastName},</h4>
    <p>
        Please verify your email address so we can know that it's really you.
        <br>
    <p>This link <b>expires in 1 hour</b></p>
    <br>
    <a href=${link}
        style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px;">Verify
        Email Address</a>
    </p>
    <div style="margin-top: 20px;">
        <h5>Best Regards</h5>
        <h5>ShareFun Team</h5>
    </div>
</div>`,
  };

  try {
    const hashedToken = await hashString(token);

    const newVerifiedEmail = await EmailVerificationModel.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    if (newVerifiedEmail) {
      await transporter.sendMail(mailOptions);
      sendResponse(res, {
        status: 201,
        message:
          'Verification email has been sent to your account. Check your email for further instructions.',
        warnings: [
          {
            code: 'VERIFICATION_EMAIL_SENT',
            details: 'Verification is pending',
          },
        ],
      });
    }
  } catch (error) {
    next(error);
  }
};

export const sendResetPassword = async (user, res, next) => {
  const { _id, email } = user;
  const token = _id + uuidv4();
  const link = APP_URL + 'users/password/reset/' + _id + '/' + token;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: 'Password Reset',
    html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;">
         Password reset link. Please click the link below to reset password.
        <br>
        <p style="font-size: 18px;"><b>This link expires in 10 minutes</b></p>
         <br>
        <a href=${link} style="color: #fff; padding: 10px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px; ">Reset Password</a>.
    </p>`,
  };

  try {
    const hashedToken = await hashString(token);

    const resetPassword = await PasswordResetModel.create({
      userId: _id,
      email: email,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    if (resetPassword) {
      await transporter.sendMail(mailOptions);
      sendResponse(res, {
        status: 201,
        message: 'Reset Password Link has been sent to your account.',
        warnings: [
          {
            code: 'PASSWORD_RESET_EMAIL_SENT',
            details: 'Password reset is pending',
          },
        ],
      });
    }
  } catch (error) {
    next(error);
  }
};
