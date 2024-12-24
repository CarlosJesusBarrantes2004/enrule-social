import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
import { sendResponse } from '../utils/sendResponse.js';
import { deleteImage, uploadImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

export const createPost = async (req, res, next) => {
  const { userId, description } = req.body;

  try {
    let file_post = null;

    if (req.files && req.files.file) {
      const response = await uploadImage(req.files.file.tempFilePath, 'posts');
      await fs.remove(req.files.file.tempFilePath);
      file_post = {
        url: response.secure_url,
        public_id: response.public_id,
      };
    }

    const newPost = await PostModel.create({
      user: userId,
      description,
      file: file_post,
    });

    const populatedPost = await PostModel.findById(newPost._id).populate({
      path: 'user',
      select: '_id firstName lastName location photo -password',
    });

    sendResponse(res, {
      status: 201,
      message: 'Post created successfully',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  const { userId } = req.body;
  const { search } = req.body;

  try {
    const user = await UserModel.findById(userId);
    const friends = user.friends.toString().split(',') ?? [];
    friends.push(userId);

    const searchPostQuery = {
      $or: [{ description: { $regex: search, $options: 'i' } }],
    };

    const posts = await PostModel.find(search ? searchPostQuery : {})
      .populate({
        path: 'user',
        select: '_id firstName lastName location photo -password',
      })
      .sort({ _id: -1 });

    const friendPosts = posts.filter((post) =>
      friends.includes(post.user._id.toString())
    );

    const otherPosts = posts.filter(
      (post) => !friends.includes(post.user._id.toString())
    );

    let postsResponse = null;

    if (friendPosts.length)
      postsResponse = search ? friendPosts : [...friendPosts, ...otherPosts];
    else postsResponse = posts;

    sendResponse(res, {
      message: 'Posts fetched successfully',
      data: postsResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id).populate({
      path: 'user',
      select: 'firstName lastName location profileUrl -password',
    });

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      error.code = 'POST_NOT_FOUND';
      next(error);
    }

    sendResponse(res, {
      message: 'Post fetched successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const postRemoved = await PostModel.findByIdAndDelete(id);

    if (!postRemoved) {
      const error = new Error('Post not found');
      error.status = 404;
      error.code = 'POST_NOT_FOUND';
      next(error);
    }

    if (postRemoved.file.public_id)
      await deleteImage(postRemoved.file.public_id);

    sendResponse(res, {
      status: 204,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const posts = await PostModel.find({ user: userId })
      .populate({
        path: 'user',
        select: '_id firstName lastName location photo -password',
      })
      .sort({ _id: -1 });

    if (!posts.length) {
      const error = new Error('Posts not found');
      error.status = 404;
      error.code = 'POSTS_NOT_FOUND';
      next(error);
    }

    sendResponse(res, {
      message: 'Post fetched successfully',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await CommentModel.find({ post: postId })
      .populate({
        path: 'user',
        select: '_id firstName lastName location photo -password',
      })
      .populate({
        path: 'replies.user',
        select: '_id firstName lastName location photo -password',
      })
      .sort({ _id: -1 });

    sendResponse(res, {
      message: 'Comments fetched successfully',
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    const post = await PostModel.findById(postId);

    //Check if user already liked the post
    const index = post.likes.findIndex((id) => id.toString() === userId);

    //If user already liked the post, remove the like
    if (index === -1) {
      post.likes.push(userId);
    }
    //If user didn't like the post, add the like
    else {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    }

    const postUpdated = await PostModel.findByIdAndUpdate(postId, post, {
      new: true,
    });

    await postUpdated.populate({
      path: 'user',
      select: '_id firstName lastName location photo -password',
    });

    sendResponse(res, {
      message: 'Post liked successfully',
      data: postUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  const { userId } = req.body;
  const { commentId, replyCommentId } = req.params;

  try {
    if (!replyCommentId || replyCommentId === 'false') {
      const comment = await CommentModel.findById(commentId);

      const index = comment.likes.findIndex((id) => id.toString() === userId);

      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      }

      const commentUpdated = await CommentModel.findByIdAndUpdate(
        commentId,
        comment,
        { new: true }
      );

      sendResponse(res, {
        message: 'Comment liked successfully',
        data: commentUpdated,
      });
    } else {
      const replyComment = await CommentModel.findOne(
        { _id: commentId },
        {
          replies: {
            $elemMatch: {
              _id: replyCommentId,
            },
          },
        }
      );

      const index = replyComment.replies[0].likes.findIndex(
        (id) => id.toString() === userId
      );

      if (index === -1) {
        replyComment.replies[0].likes.push(userId);
      } else {
        replyComment.replies[0].likes = replyComment.replies[0].likes.filter(
          (id) => id.toString() !== userId
        );
      }

      const query = { _id: commentId, 'replies._id': replyCommentId };
      const updated = {
        $set: {
          'replies.$.likes': replyComment.replies[0].likes,
        },
      };
      const commentUpdated = await CommentModel.updateOne(query, updated, {
        new: true,
      });

      sendResponse(res, {
        message: 'Comment liked successfully',
        data: commentUpdated,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const commentPost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId, comment, from } = req.body;

  try {
    const newComment = await CommentModel.create({
      user: userId,
      post: postId,
      comment,
      from,
    });

    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    await newComment.populate({
      path: 'user',
      select: '_id firstName lastName location photo -password',
    });

    sendResponse(res, {
      status: 201,
      message: 'Comment added successfully',
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const replyComment = async (req, res, next) => {
  const { userId, comment, from, replyAt } = req.body;
  const { commentId } = req.params;

  try {
    const commentInfo = await CommentModel.findById(commentId);

    commentInfo.replies.push({
      user: userId,
      comment,
      from,
      replyAt,
      createdAt: Date.now(),
    });

    commentInfo.save();

    sendResponse(res, {
      status: 201,
      message: 'Reply added successfully',
      data: commentInfo,
    });
  } catch (error) {
    next(error);
  }
};
