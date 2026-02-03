function money(x) {
  if (x === null || x === undefined) return "—";
  return String(x);
}

export default function ServicesGrid({ services, busy, search, setSearch, onSearch, onBook }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
          <label className="block text-sm font-medium text-zinc-200">Search services</label>
          <div className="mt-2 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g., ac, plumbing, cleaning..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
            />
            <button
              type="button"
              disabled={busy}
              onClick={onSearch}
              className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
            >
              Search
            </button>
          </div>
        </div>

        <div className="text-sm text-zinc-400">
          Found <span className="text-zinc-200 font-medium">{(services ?? []).length}</span>{" "}
          service(s)
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(services ?? []).map((s) => (
          <div
            key={s._id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 hover:bg-zinc-950/55 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-zinc-100">{s.title}</div>
                <div className="mt-1 text-sm text-zinc-400 line-clamp-2">
                  {s.description || "—"}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm text-zinc-200">
                {money(s.price)}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <span>Duration</span>
              <span className="text-zinc-200">{s.duration ? `${s.duration} min` : "—"}</span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={() => onBook(s)}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-60"
              >
                Book
              </button>
            </div>
          </div>
        ))}

        {(services ?? []).length === 0 ? (
          <div className="col-span-full rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 text-sm text-zinc-400">
            No services found. Try a different search.
          </div>
        ) : null}
      </div>
    </div>
  );
}
