import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeType } from '../types/types';

interface ThemeState {
  theme: ThemeType;
}

const DEFAULT_THEME: ThemeType = 'dark';

const getInitialTheme = (): ThemeType => {
  const storedTheme = window?.localStorage.getItem('theme');
  if (storedTheme) {
    try {
      const parsedTheme = JSON.parse(storedTheme);
      if (parsedTheme === 'light' || parsedTheme === 'dark') {
        return parsedTheme;
      }
    } catch (error) {
      console.log('Error parsing theme from localStorage: ', error);
    }
  }
  return DEFAULT_THEME;
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
      window?.localStorage.setItem('theme', JSON.stringify(action.payload));
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
