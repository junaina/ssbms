import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  providerCreateService,
  providerDeleteService,
  providerListBookings,
  providerListServices,
  providerUnbook,
  providerUpdateService,
  providerFulfillBooking,
} from "./providerApi";

const initialState = {
  tab: "services", // "services" | "bookings"

  services: [],
  bookings: [],

  status: "idle", // idle | loading | succeeded | failed
  actionStatus: "idle", // for create/edit/delete/unbook
  error: "",
};

export const fetchProviderServicesThunk = createAsyncThunk(
  "provider/fetchServices",
  async (_, thunkAPI) => {
    try {
      const res = await providerListServices();
      return res.services ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const fetchProviderBookingsThunk = createAsyncThunk(
  "provider/fetchBookings",
  async (_, thunkAPI) => {
    try {
      const res = await providerListBookings();
      return res.bookings ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const createServiceThunk = createAsyncThunk(
  "provider/createService",
  async (payload, thunkAPI) => {
    try {
      const res = await providerCreateService(payload);
      return res.service;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const updateServiceThunk = createAsyncThunk(
  "provider/updateService",
  async ({ serviceId, patch }, thunkAPI) => {
    try {
      const res = await providerUpdateService(serviceId, patch);
      return res.service;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const deleteServiceThunk = createAsyncThunk(
  "provider/deleteService",
  async ({ serviceId }, thunkAPI) => {
    try {
      const res = await providerDeleteService(serviceId);
      return res.deletedId ?? serviceId;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const unbookThunk = createAsyncThunk("provider/unbook", async ({ bookingId }, thunkAPI) => {
  try {
    const res = await providerUnbook(bookingId);
    return res.deletedId ?? bookingId;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});
export const fulfillBookingThunk = createAsyncThunk(
  "provider/fulfillBooking",
  async ({ bookingId }, thunkAPI) => {
    try {
      const res = await providerFulfillBooking(bookingId);
      return res.booking;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setProviderTab(state, action) {
      state.tab = action.payload;
    },
    clearProviderError(state) {
      state.error = "";
    },
    resetProviderState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch services
      .addCase(fetchProviderServicesThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchProviderServicesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.services = action.payload;
      })
      .addCase(fetchProviderServicesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load services";
      })

      // fetch bookings
      .addCase(fetchProviderBookingsThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchProviderBookingsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(fetchProviderBookingsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load bookings";
      })

      // create service
      .addCase(createServiceThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(createServiceThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        if (action.payload?._id) state.services = [action.payload, ...state.services];
      })
      .addCase(createServiceThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to create service";
      })

      // update service
      .addCase(updateServiceThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(updateServiceThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;
        if (!updated?._id) return;
        state.services = state.services.map((s) =>
          s._id === updated._id ? { ...s, ...updated } : s,
        );
      })
      .addCase(updateServiceThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to update service";
      })

      // delete service
      .addCase(deleteServiceThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(deleteServiceThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const id = action.payload;
        state.services = state.services.filter((s) => s._id !== id);
      })
      .addCase(deleteServiceThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to delete service";
      })

      // unbook
      .addCase(unbookThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(unbookThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const id = action.payload;
        state.bookings = state.bookings.filter((b) => b._id !== id);
      })
      .addCase(unbookThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to unbook";
      })
      //fulfill booking
      .addCase(fulfillBookingThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(fulfillBookingThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;
        if (!updated?._id) return;
        state.bookings = state.bookings.map((b) => (b._id === updated._id ? updated : b));
      })
      .addCase(fulfillBookingThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to mark booking fulfilled";
      });
  },
});

export const { setProviderTab, clearProviderError, resetProviderState } = providerSlice.actions;
export default providerSlice.reducer;
