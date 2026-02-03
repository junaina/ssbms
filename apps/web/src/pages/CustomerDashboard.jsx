import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomerShell from "../features/customer/components/CustomerShell";
import Tabs from "../features/provider/components/Tabs"; // reuse provider Tabs
import ServicesGrid from "../features/customer/components/ServicesGrid";
import BookingModal from "../features/customer/components/BookingModal";
import MyBookingsTable from "../features/customer/components/MyBookingsTable";

import {
  createBookingThunk,
  fetchMyBookingsThunk,
  searchServicesThunk,
  setCustomerSearch,
  setCustomerTab,
} from "../features/customer/customerSlice";

export default function CustomerDashboard({ me, onLoggedOut }) {
  const dispatch = useDispatch();
  const { tab, search, services, bookings, browseStatus, bookingsStatus, actionStatus, error } =
    useSelector((s) => s.customer);

  const busyBrowse = browseStatus === "loading";
  const busyBookings = bookingsStatus === "loading";
  const busyAction = actionStatus === "loading";

  const [bookingModal, setBookingModal] = useState({ open: false, service: null });
  const [searchBookings, setSearchBookings] = useState("");

  const headerRight = useMemo(() => {
    return (
      <>
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2">
          <div className="text-sm text-zinc-200 font-medium">
            {me?.firstName} {me?.lastName}
          </div>
          <span className="text-xs text-zinc-500">CUSTOMER</span>
        </div>

        <button
          onClick={onLoggedOut}
          className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white"
          type="button"
        >
          Logout
        </button>
      </>
    );
  }, [me, onLoggedOut]);

  // Initial load
  useEffect(() => {
    if (tab === "browse") {
      dispatch(searchServicesThunk({ search }));
    } else {
      dispatch(fetchMyBookingsThunk());
    }
  }, [dispatch, tab]); // intentionally not adding search

  function runSearch() {
    dispatch(searchServicesThunk({ search }));
  }

  function openBook(service) {
    setBookingModal({ open: true, service });
  }

  async function confirmBooking({ serviceId, date }) {
    await dispatch(createBookingThunk({ serviceId, date }));
    setBookingModal({ open: false, service: null });

    // After booking, hop to "My Bookings" and refresh
    dispatch(setCustomerTab("myBookings"));
    dispatch(fetchMyBookingsThunk());
  }

  return (
    <CustomerShell
      title="Customer Dashboard"
      subtitle="Browse services and manage your bookings."
      right={headerRight}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={tab}
          onChange={(k) => dispatch(setCustomerTab(k))}
          tabs={[
            { key: "browse", label: "Browse Services" },
            { key: "myBookings", label: "My Bookings" },
          ]}
        />

        <button
          type="button"
          disabled={busyBrowse || busyBookings}
          onClick={() => (tab === "browse" ? runSearch() : dispatch(fetchMyBookingsThunk()))}
          className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6">
        {tab === "browse" ? (
          <ServicesGrid
            services={services}
            busy={busyBrowse || busyAction}
            search={search}
            setSearch={(v) => dispatch(setCustomerSearch(v))}
            onSearch={runSearch}
            onBook={openBook}
          />
        ) : (
          <MyBookingsTable
            bookings={bookings}
            busy={busyBookings}
            search={searchBookings}
            setSearch={setSearchBookings}
          />
        )}
      </div>

      <BookingModal
        open={bookingModal.open}
        service={bookingModal.service}
        busy={busyAction}
        onClose={() => setBookingModal({ open: false, service: null })}
        onConfirm={confirmBooking}
      />
    </CustomerShell>
  );
}
