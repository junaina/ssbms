function fmtDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d ?? "");
  }
}

function providerName(p) {
  if (!p) return "—";
  if (typeof p === "string") return p;
  const name = `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
  return name || p.email || p._id || "—";
}

function serviceTitle(s) {
  if (!s) return "—";
  if (typeof s === "string") return s;
  return s.title || s._id || "—";
}

export default function MyBookingsTable({ bookings, busy, search, setSearch }) {
  const filtered = (bookings ?? []).filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      providerName(b.providerId).toLowerCase().includes(q) ||
      serviceTitle(b.serviceId).toLowerCase().includes(q) ||
      (b.status ?? "").toLowerCase().includes(q)
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
            placeholder="provider, service, status..."
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
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {filtered.map((b) => (
              <tr key={b._id} className="hover:bg-zinc-950/30">
                <td className="px-4 py-3 text-zinc-100">{serviceTitle(b.serviceId)}</td>
                <td className="px-4 py-3 text-zinc-200">{providerName(b.providerId)}</td>
                <td className="px-4 py-3 text-zinc-400">{fmtDate(b.date)}</td>
                <td className="px-4 py-3 text-zinc-200">{b.status ?? "—"}</td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-zinc-400">
                  No bookings yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {busy ? <div className="mt-4 text-sm text-zinc-400">Loading…</div> : null}
    </div>
  );
}
