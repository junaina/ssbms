export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  busy,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={busy ? undefined : onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        {description ? <p className="mt-2 text-sm text-zinc-400">{description}</p> : null}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
          >
            {busy ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
