import mongoose, { Schema } from 'mongoose';

const EmailVerificationSchema = new Schema({
  userId: String,
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const EmailVerificationModel = mongoose.model(
  'EmailVerification',
  EmailVerificationSchema
);

export default EmailVerificationModel;
