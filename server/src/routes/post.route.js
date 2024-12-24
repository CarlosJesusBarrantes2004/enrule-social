import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPost,
  getPostsUser,
  getComments,
  likePost,
  deletePost,
  commentPost,
  replyComment,
  likeComment,
} from '../controllers/post.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { postSchema } from '../schemas/post.schema.js';
import { userAuth } from '../middlewares/userAuth.js';
import {
  commentSchema,
  replyCommentSchema,
} from '../schemas/comment.schema.js';

const router = Router();

router.post('/', userAuth, validateSchema(postSchema), createPost);
router.get('/', userAuth, getPosts);
router.get('/:id', userAuth, getPost);
router.delete('/:id', userAuth, deletePost);

//Posts User
router.get('/user/:userId', userAuth, getPostsUser);

//Comments
router.get('/comments/:postId', userAuth, getComments);
router.post('/comment/like/:commentId/:replyCommentId?', userAuth, likeComment);
router.post(
  '/comment/:postId',
  userAuth,
  validateSchema(commentSchema),
  commentPost
);
router.post(
  '/comment/reply/:commentId',
  userAuth,
  validateSchema(replyCommentSchema),
  replyComment
);

//Likes
router.post('/like/:postId', userAuth, likePost);

export default router;
