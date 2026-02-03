import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProviderShell from "../features/provider/components/ProviderShell";
import Tabs from "../features/provider/components/Tabs";
import ServicesTable from "../features/provider/components/ServicesTable";
import BookingsTable from "../features/provider/components/BookingsTable";
import ServiceModal from "../features/provider/components/ServiceModal";

// reuse the admin ConfirmModal
import ConfirmModal from "../features/admin/components/ConfirmModal";

import {
  createServiceThunk,
  deleteServiceThunk,
  fetchProviderBookingsThunk,
  fetchProviderServicesThunk,
  setProviderTab,
  unbookThunk,
  updateServiceThunk,
  fulfillBookingThunk,
} from "../features/provider/providerSlice";

export default function ProviderDashboard({ me, onLoggedOut }) {
  const dispatch = useDispatch();
  const { tab, services, bookings, status, actionStatus, error } = useSelector((s) => s.provider);

  const busy = status === "loading" || actionStatus === "loading";

  const [serviceModal, setServiceModal] = useState({ open: false, mode: "create", initial: null });
  const [confirm, setConfirm] = useState({ open: false, kind: "", id: "", label: "" });

  const [searchServices, setSearchServices] = useState("");
  const [searchBookings, setSearchBookings] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const approved = !!me?.isApproved;

  // only fetch if approved (avoids backend 403 spam + nicer UX)
  useEffect(() => {
    if (!approved) return;

    if (tab === "services") dispatch(fetchProviderServicesThunk());
    if (tab === "bookings") dispatch(fetchProviderBookingsThunk());
  }, [dispatch, tab, approved]);

  const headerRight = useMemo(() => {
    return (
      <>
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2">
          <div className="text-sm text-zinc-200 font-medium">
            {me?.firstName} {me?.lastName}
          </div>
          <span className="text-xs text-zinc-500">PROVIDER</span>
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

  function refresh() {
    if (!approved) return;
    if (tab === "services") dispatch(fetchProviderServicesThunk());
    if (tab === "bookings") dispatch(fetchProviderBookingsThunk());
  }

  // ---- services
  function openCreate() {
    setServiceModal({ open: true, mode: "create", initial: null });
  }

  function openEdit(service) {
    setServiceModal({ open: true, mode: "edit", initial: service });
  }
  async function fulfill(booking) {
    await dispatch(fulfillBookingThunk({ bookingId: booking._id }));
  }

  async function submitService(payload) {
    if (serviceModal.mode === "create") {
      await dispatch(createServiceThunk(payload));
    } else {
      await dispatch(updateServiceThunk({ serviceId: serviceModal.initial._id, patch: payload }));
    }
    setServiceModal({ open: false, mode: "create", initial: null });
  }

  function askDeleteService(service) {
    setConfirm({
      open: true,
      kind: "service",
      id: service._id,
      label: service.title || service._id,
    });
  }

  // ---- bookings
  function askUnbook(booking) {
    setConfirm({
      open: true,
      kind: "booking",
      id: booking._id,
      label: booking._id,
    });
  }

  async function doConfirm() {
    const { kind, id } = confirm;
    setConfirm({ open: false, kind: "", id: "", label: "" });

    if (kind === "service") {
      await dispatch(deleteServiceThunk({ serviceId: id }));
      return;
    }
    if (kind === "booking") {
      await dispatch(unbookThunk({ bookingId: id }));
      return;
    }
  }

  // Pending approval screen (clean, consistent)
  if (!approved) {
    return (
      <ProviderShell
        title="Provider Dashboard"
        subtitle="Your account is pending approval. Once approved, you can create services and manage bookings."
        right={headerRight}
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <div className="text-lg font-semibold text-zinc-100">Pending approval</div>
          <p className="mt-2 text-sm text-zinc-400">
            An admin needs to approve your provider account. After approval, this dashboard will
            unlock:
          </p>
          <ul className="mt-4 list-disc pl-5 text-sm text-zinc-300 space-y-1">
            <li>Create and manage services</li>
            <li>View incoming bookings</li>
            <li>Unbook bookings</li>
          </ul>
        </div>
      </ProviderShell>
    );
  }

  return (
    <ProviderShell
      title="Provider Dashboard"
      subtitle="Create services and manage your bookings."
      right={headerRight}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={tab}
          onChange={(k) => dispatch(setProviderTab(k))}
          tabs={[
            { key: "services", label: "My Services" },
            { key: "bookings", label: "My Bookings" },
          ]}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={refresh}
            className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
          >
            {busy ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6">
        {tab === "services" ? (
          <ServicesTable
            services={services}
            busy={busy}
            onCreate={openCreate}
            onEdit={openEdit}
            onDelete={askDeleteService}
            search={searchServices}
            setSearch={setSearchServices}
          />
        ) : (
          <BookingsTable
            bookings={bookings}
            busy={busy}
            onUnbook={askUnbook}
            onFulfill={fulfill}
            search={searchBookings}
            setSearch={setSearchBookings}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
      </div>

      <ServiceModal
        key={`${serviceModal.mode}:${serviceModal.initial?._id ?? "new"}`}
        open={serviceModal.open}
        mode={serviceModal.mode}
        initial={serviceModal.initial}
        busy={actionStatus === "loading"}
        onClose={() => setServiceModal({ open: false, mode: "create", initial: null })}
        onSubmit={submitService}
      />

      <ConfirmModal
        open={confirm.open}
        title={confirm.kind === "service" ? "Delete this service?" : "Unbook this booking?"}
        description={
          confirm.kind === "service"
            ? `This will permanently delete: ${confirm.label}.`
            : `This will hard-delete the booking.`
        }
        confirmText={confirm.kind === "service" ? "Delete" : "Unbook"}
        busy={actionStatus === "loading"}
        onCancel={() => setConfirm({ open: false, kind: "", id: "", label: "" })}
        onConfirm={doConfirm}
      />
    </ProviderShell>
  );
}
