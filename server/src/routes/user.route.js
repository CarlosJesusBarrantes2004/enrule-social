import { Router } from 'express';
import path from 'path';
import {
  requestResetPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequests,
  acceptRequest,
  profileView,
  getSuggestedFriends,
} from '../controllers/user.controller.js';
import { userAuth } from '../middlewares/userAuth.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { updateUserSchema } from '../schemas/user.schema.js';

const router = Router();
const __dirname = path.resolve(path.dirname(''));

//Email verification
router.get('/email/verify/:id/:token', verifyEmail);
router.get('/email/verify-page', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'src', 'views', 'email-verification', 'index.html')
  );
});

//Reset password
router.post('/password/request-reset', requestResetPassword);
router.get('/password/reset/:id/:token', resetPassword);
router.post('/password/reset', changePassword);
router.get('/password/reset-page', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'src', 'views', 'reset-password', 'index.html')
  );
});

//User profile
router.get('/:id?', userAuth, getUser); //ID is optional
router.put('/', userAuth, validateSchema(updateUserSchema), updateUser);

//Friend request
router.post('/friend/request', userAuth, friendRequest);
router.get('/friend/requests', userAuth, getFriendRequests);
router.post('/friend/accept', userAuth, acceptRequest);

//Suggested friends
router.get('/friends/suggested', userAuth, getSuggestedFriends);

//Profile view
router.post('/profile/view', userAuth, profileView);

export default router;
