import mongoose, { Schema } from 'mongoose';

const FriendRequestSchema = new Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: 'User' },
    requestFrom: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const FriendRequestModel = mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequestModel;
