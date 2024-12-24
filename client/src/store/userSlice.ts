import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Friend, User } from '../types/types';

interface UserState {
  user: User | null;
  edit: boolean;
}

const initialState: UserState = {
  user: JSON.parse(window?.localStorage.getItem('user') || 'null'),
  edit: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload || 'null'));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    updateProfile: (state, action: PayloadAction<boolean>) => {
      state.edit = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.user?.friends.push(action.payload);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const { login, logout, updateProfile, addFriend } = userSlice.actions;
export default userSlice.reducer;
