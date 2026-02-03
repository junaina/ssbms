function IconButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-xl border border-red-900/40 bg-red-950/30 px-3 py-2 text-sm text-red-200 hover:bg-red-950/50 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function fmtDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d ?? "");
  }
}
function StatusPill({ status }) {
  const s = (status ?? "—").toUpperCase();
  const cls =
    s === "FULFILLED"
      ? "border-emerald-900/40 bg-emerald-950/30 text-emerald-200"
      : s === "CANCELLED"
        ? "border-red-900/40 bg-red-950/30 text-red-200"
        : "border-zinc-800 bg-zinc-950/40 text-zinc-200";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>
      {s}
    </span>
  );
}

function displayName(u) {
  if (!u) return "—";
  if (typeof u === "string") return u;
  const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return name || u.email || u._id || "—";
}

function serviceTitle(s) {
  if (!s) return "—";
  if (typeof s === "string") return s;
  return s.title || s._id || "—";
}
export default function BookingsTable({ bookings, busy, onUnbook, onFulfill, search, setSearch }) {
  const filtered = (bookings ?? []).filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const customer = displayName(b.customerId).toLowerCase();
    const service = serviceTitle(b.serviceId).toLowerCase();
    return (
      customer.includes(q) || service.includes(q) || (b.status ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label className="block text-sm font-medium text-zinc-200">Search bookings</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="customer, service, status..."
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>

        <div className="text-sm text-zinc-400">
          Showing <span className="text-zinc-200 font-medium">{filtered.length}</span> booking(s)
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950/40">
            <tr className="text-left text-zinc-300">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {filtered.map((b) => (
              <tr key={b._id} className="hover:bg-zinc-950/30">
                <td className="px-4 py-3 text-zinc-100">{displayName(b.customerId)}</td>
                <td className="px-4 py-3 text-zinc-200">{serviceTitle(b.serviceId)}</td>
                <td className="px-4 py-3 text-zinc-400">{fmtDate(b.date)}</td>
                <td className="px-4 py-3 text-zinc-200">
                  <StatusPill status={b.status} />
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {String(b.status).toUpperCase() === "PENDING" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onFulfill(b)}
                        className="rounded-xl border border-emerald-900/40 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-950/50 disabled:opacity-60"
                      >
                        Complete
                      </button>
                    ) : null}

                    <IconButton disabled={busy} onClick={() => onUnbook(b)} type="button">
                      Unbook
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                  No bookings yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
