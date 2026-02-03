import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBooking, listMyBookings, searchServices } from "./customerApi";

const initialState = {
  tab: "browse", // browse | myBookings

  // browse
  search: "",
  services: [],
  browseStatus: "idle", // idle | loading | succeeded | failed

  // bookings
  bookings: [],
  bookingsStatus: "idle",

  // create booking
  actionStatus: "idle", // idle | loading | succeeded | failed

  error: "",
};

export const searchServicesThunk = createAsyncThunk(
  "customer/searchServices",
  async ({ search }, thunkAPI) => {
    try {
      const res = await searchServices(search);
      return { services: res.services ?? [], search };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const fetchMyBookingsThunk = createAsyncThunk(
  "customer/fetchMyBookings",
  async (_, thunkAPI) => {
    try {
      const res = await listMyBookings();
      return res.bookings ?? [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const createBookingThunk = createAsyncThunk(
  "customer/createBooking",
  async ({ serviceId, date }, thunkAPI) => {
    try {
      const res = await createBooking({ serviceId, date });
      return res.booking;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerTab(state, action) {
      state.tab = action.payload;
      state.error = "";
    },
    setCustomerSearch(state, action) {
      state.search = action.payload;
    },
    clearCustomerError(state) {
      state.error = "";
    },
    resetCustomerState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // search services
      .addCase(searchServicesThunk.pending, (state) => {
        state.browseStatus = "loading";
        state.error = "";
      })
      .addCase(searchServicesThunk.fulfilled, (state, action) => {
        state.browseStatus = "succeeded";
        state.services = action.payload.services;
        state.search = action.payload.search;
      })
      .addCase(searchServicesThunk.rejected, (state, action) => {
        state.browseStatus = "failed";
        state.error = action.payload || "Failed to load services";
      })

      // my bookings
      .addCase(fetchMyBookingsThunk.pending, (state) => {
        state.bookingsStatus = "loading";
        state.error = "";
      })
      .addCase(fetchMyBookingsThunk.fulfilled, (state, action) => {
        state.bookingsStatus = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookingsThunk.rejected, (state, action) => {
        state.bookingsStatus = "failed";
        state.error = action.payload || "Failed to load bookings";
      })

      // create booking
      .addCase(createBookingThunk.pending, (state) => {
        state.actionStatus = "loading";
        state.error = "";
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const booking = action.payload;
        if (booking?._id) state.bookings = [booking, ...state.bookings];
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to create booking";
      });
  },
});

export const { setCustomerTab, setCustomerSearch, clearCustomerError, resetCustomerState } =
  customerSlice.actions;

export default customerSlice.reducer;
