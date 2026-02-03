function IconButton({ children, tone = "zinc", ...props }) {
  const tones = {
    zinc: "border-zinc-800 bg-zinc-950/40 text-zinc-200 hover:bg-zinc-900",
    danger: "border-red-900/40 bg-red-950/30 text-red-200 hover:bg-red-950/50",
  };

  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed",
        tones[tone],
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function ServicesTable({
  services,
  busy,
  onCreate,
  onEdit,
  onDelete,
  search,
  setSearch,
}) {
  const filtered = (services ?? []).filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (s.title ?? "").toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label className="block text-sm font-medium text-zinc-200">Search services</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="title or description..."
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onCreate}
            className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-60"
          >
            + New service
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950/40">
            <tr className="text-left text-zinc-300">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {filtered.map((s) => (
              <tr key={s._id} className="hover:bg-zinc-950/30">
                <td className="px-4 py-3 font-medium text-zinc-100">{s.title}</td>
                <td className="px-4 py-3 text-zinc-200">{s.price}</td>
                <td className="px-4 py-3 text-zinc-200">{s.duration} min</td>
                <td className="px-4 py-3 text-zinc-400 max-w-md">
                  <span className="line-clamp-2">{s.description || "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <IconButton disabled={busy} onClick={() => onEdit(s)} type="button">
                      Edit
                    </IconButton>
                    <IconButton
                      tone="danger"
                      disabled={busy}
                      onClick={() => onDelete(s)}
                      type="button"
                    >
                      Delete
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                  No services yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
