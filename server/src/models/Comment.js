import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    comment: { type: String, required: true },
    from: { type: String, required: true },
    replies: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        from: { type: String },
        replyAt: { type: String },
        comment: { type: String, required: true },
        likes: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: String }],
  },
  { timestamps: true }
);

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
