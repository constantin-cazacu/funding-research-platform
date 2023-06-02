// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  role: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.loggedIn = true;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout(state) {
      state.loggedIn = false;
      state.role = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
