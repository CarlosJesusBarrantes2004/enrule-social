import { combineReducers } from '@reduxjs/toolkit';

import userSlice from './userSlice';
import themeSlice from './themeSlice';
import postSlice from './postSlice';
import messageSlice from './messageSlice';

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  post: postSlice,
  message: messageSlice,
});

export { rootReducer };
