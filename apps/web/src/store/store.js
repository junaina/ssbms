import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";
import providerReducer from "../features/provider/providerSlice";
import customerReducer from "../features/customer/customerSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    provider: providerReducer,
    customer: customerReducer,
  },
});
