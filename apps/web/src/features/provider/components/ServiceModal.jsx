import { useMemo, useState } from "react";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-200">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function ServiceModal({ open, mode, initial, busy, onClose, onSubmit }) {
  const isEdit = mode === "edit";

  // Initialize once on mount (remount happens via `key` in ProviderDashboard)
  const [title, setTitle] = useState(() => initial?.title ?? "");
  const [description, setDescription] = useState(() => initial?.description ?? "");
  const [price, setPrice] = useState(() => (initial?.price ?? "").toString());
  const [duration, setDuration] = useState(() => (initial?.duration ?? "").toString());

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    const p = Number(price);
    const d = Number(duration);
    if (!Number.isFinite(p) || p < 0) return false;
    if (!Number.isFinite(d) || d < 1) return false;
    return true;
  }, [title, price, duration]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={busy ? undefined : onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-100">
          {isEdit ? "Edit Service" : "Create Service"}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          {isEdit ? "Update service details." : "Add a new service for customers to book."}
        </p>

        <div className="mt-5 grid gap-4">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AC Repair"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short details..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Price">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 2500"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
              />
            </Field>

            <Field label="Duration (minutes)">
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 60"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy || !canSubmit}
            onClick={() =>
              onSubmit({
                title: title.trim(),
                description,
                price: Number(price),
                duration: Number(duration),
              })
            }
            className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-60"
          >
            {busy ? "Working..." : isEdit ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
