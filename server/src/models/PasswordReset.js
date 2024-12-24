import mongoose, { Schema } from 'mongoose';

const PasswordResetSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },
  email: { type: String, unique: true },
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const PasswordResetModel = mongoose.model('ResetPassword', PasswordResetSchema);

export default PasswordResetModel;
