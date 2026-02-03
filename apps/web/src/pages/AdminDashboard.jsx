import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminShell from "../features/admin/components/AdminShell";
import RoleFilter from "../features/admin/components/RoleFilter";
import UserTable from "../features/admin/components/UserTable";
import ConfirmModal from "../features/admin/components/ConfirmModal";
import {
  fetchAdminUsersThunk,
  setRoleFilter,
  setProviderApprovalThunk,
  deleteUserThunk,
} from "../features/admin/adminSlice";
import { logout as logoutAction } from "../features/auth/authSlice";

export default function AdminDashboard({ me }) {
  const dispatch = useDispatch();
  const { users, roleFilter, status, actionStatus, error } = useSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState({ open: false, userId: "", label: "" });

  const busy = status === "loading" || actionStatus === "loading";

  useEffect(() => {
    dispatch(fetchAdminUsersThunk({ role: roleFilter }));
  }, [dispatch, roleFilter]);

  const headerRight = useMemo(() => {
    return (
      <>
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2">
          <div className="text-sm text-zinc-200 font-medium">
            {me?.firstName} {me?.lastName}
          </div>
          <span className="text-xs text-zinc-500">ADMIN</span>
        </div>

        <button
          onClick={() => dispatch(logoutAction())}
          className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white"
          type="button"
        >
          Logout
        </button>
      </>
    );
  }, [dispatch, me]);

  function onChangeRole(role) {
    dispatch(setRoleFilter(role));
    setSearch("");
  }

  function approve(id) {
    dispatch(setProviderApprovalThunk({ userId: id, isApproved: true }));
  }
  function revoke(id) {
    dispatch(setProviderApprovalThunk({ userId: id, isApproved: false }));
  }

  function askDelete(userId, label) {
    setConfirm({ open: true, userId, label });
  }

  function confirmDelete() {
    dispatch(deleteUserThunk({ userId: confirm.userId }));
    setConfirm({ open: false, userId: "", label: "" });
  }

  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="Manage providers and customers — approve providers, and remove accounts when needed."
      right={headerRight}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <RoleFilter value={roleFilter} onChange={onChangeRole} />

        <button
          type="button"
          disabled={busy}
          onClick={() => dispatch(fetchAdminUsersThunk({ role: roleFilter }))}
          className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
        >
          {busy ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="mt-6 text-sm text-zinc-400">Loading users…</div>
      ) : (
        <div className="mt-6">
          <UserTable
            users={users}
            actionBusy={actionStatus === "loading"}
            onApprove={approve}
            onRevoke={revoke}
            onDelete={askDelete}
            search={search}
            setSearch={setSearch}
          />
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Delete this user?"
        description={`You’re about to permanently delete: ${confirm.label}. This cannot be undone.`}
        confirmText="Delete"
        busy={actionStatus === "loading"}
        onCancel={() => setConfirm({ open: false, userId: "", label: "" })}
        onConfirm={confirmDelete}
      />
    </AdminShell>
  );
}
