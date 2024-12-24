import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types/types';

interface MessageState {
  message: Message | null;
}

const initialState: MessageState = {
  message: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<Message>) {
      state.message = action.payload;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
});

export const { setMessage, resetMessage } = messageSlice.actions;
export default messageSlice.reducer;
