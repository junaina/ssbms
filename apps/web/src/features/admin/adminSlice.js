import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminDeleteUser, adminListUsers, adminSetApproval } from "./adminApi";

const initialState = {
  users: [],
  roleFilter: "ALL", // ALL | PROVIDER | CUSTOMER
  status: "idle", // idle | loading | succeeded | failed
  actionStatus: "idle", // for approve/delete
  error: "",
};

export const fetchAdminUsersThunk = createAsyncThunk(
  "admin/fetchUsers",
  async ({ role }, thunkAPI) => {
    try {
      const res = await adminListUsers(role);
      // backend returns { ok: true, users }
      return { users: res.users ?? [], role };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const setProviderApprovalThunk = createAsyncThunk(
  "admin/setApproval",
  async ({ userId, isApproved }, thunkAPI) => {
    try {
      const res = await adminSetApproval(userId, isApproved);
      // backend returns { ok: true, user }
      return { user: res.user };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const deleteUserThunk = createAsyncThunk(
  "admin/deleteUser",
  async ({ userId }, thunkAPI) => {
    try {
      const res = await adminDeleteUser(userId);
      // backend returns { ok: true, deletedId }
      return { deletedId: res.deletedId ?? userId };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setRoleFilter(state, action) {
      state.roleFilter = action.payload;
    },
    clearAdminError(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch users
      .addCase(fetchAdminUsersThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchAdminUsersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.roleFilter = action.payload.role;
      })
      .addCase(fetchAdminUsersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch users";
      })

      // approve/revoke
      .addCase(setProviderApprovalThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(setProviderApprovalThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload.user;
        if (!updated?._id) return;
        state.users = state.users.map((u) => (u._id === updated._id ? { ...u, ...updated } : u));
      })
      .addCase(setProviderApprovalThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to update approval";
      })

      // delete
      .addCase(deleteUserThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const id = action.payload.deletedId;
        state.users = state.users.filter((u) => u._id !== id);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to delete user";
      });
  },
});

export const { setRoleFilter, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
