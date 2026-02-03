import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch, setToken, clearToken } from "./authApi";
const initialState = {
  user: null,
  token: localStorage.getItem("ssbms_token"),
  status: "idle", //idle | loading | succeeded | failed
  error: "",
};

//register
export const registerThunk = createAsyncThunk(
  "/auth/register",
  async ({ firstName, lastName, email, password, role }, thunkAPI) => {
    try {
      const res = await apiFetch("auth/register", {
        method: "POST",
        body: { firstName, lastName, email, password, role },
      });
      const token = res?.data?.token;
      if (token) setToken(token);
      return { user: res.data.user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const loginThunk = createAsyncThunk("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    const res = await apiFetch("auth/login", {
      method: "POST",
      body: { email, password },
    });
    const token = res?.data?.token;
    if (token) setToken(token);
    return { user: res.data.user, token };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

//me thunk recieves no request body, only the thunkAPI function
export const meThunk = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await apiFetch("auth/me", { auth: true });
    return { user: res.data.user };
  } catch (error) {
    clearToken();
    return thunkAPI.rejectWithValue(error.message);
  }
});

//auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = "";
      clearToken();
    },
  },
  extraReducers: (builder) => {
    builder
      //register
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Register failed";
      })
      //login
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login Failed";
      })
      //me
      .addCase(meThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(meThunk.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        state.error = action.payload || "";
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
