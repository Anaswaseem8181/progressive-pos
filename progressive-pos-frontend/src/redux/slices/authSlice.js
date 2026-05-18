import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../api/authService";

const savedUser = localStorage.getItem("pos_user");
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

// Enforce strict payment gate: keep admins with billingStatus other than 'active' unauthenticated on reload
const initialState = {
  user: (parsedUser && parsedUser.role === 'admin' && parsedUser.billingStatus !== 'active') ? null : parsedUser,
  isLoading: false,
  isError: false,
  message: "",
};

// Register user
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      return await authService.login(user.email, user.password);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    updateCurrency: (state, action) => {
      if (state.user) {
        state.user.currency = action.payload;
        localStorage.setItem("pos_user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store in localStorage so apiClient can use the token for the subscribe call
        // but don't set state.user so the UI remains "unauthenticated"
        localStorage.setItem("pos_user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("pos_user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset, updateCurrency } = authSlice.actions;
export default authSlice.reducer;
