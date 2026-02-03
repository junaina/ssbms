function Badge({ tone = "zinc", children }) {
  const toneMap = {
    zinc: "border-zinc-700 text-zinc-200 bg-zinc-900/40",
    green: "border-emerald-900/40 text-emerald-200 bg-emerald-950/30",
    red: "border-red-900/40 text-red-200 bg-red-950/30",
    blue: "border-sky-900/40 text-sky-200 bg-sky-950/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2 py-1 text-xs ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}

function IconButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export default function UserTable({
  users,
  actionBusy,
  onApprove,
  onRevoke,
  onDelete,
  search,
  setSearch,
}) {
  const filtered = (users ?? []).filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
    return (
      name.includes(s) ||
      (u.email ?? "").toLowerCase().includes(s) ||
      (u.role ?? "").toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label className="block text-sm font-medium text-zinc-200">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="name, email, role..."
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>

        <div className="text-sm text-zinc-400">
          Showing <span className="text-zinc-200 font-medium">{filtered.length}</span> user(s)
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950/40">
            <tr className="text-left text-zinc-300">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Approval</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {filtered.map((u) => {
              const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—";
              const isProvider = u.role === "PROVIDER";
              const approved = !!u.isApproved;

              return (
                <tr key={u._id} className="hover:bg-zinc-950/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-100">{fullName}</div>
                    <div className="text-xs text-zinc-500">{u._id}</div>
                  </td>

                  <td className="px-4 py-3 text-zinc-200">{u.email}</td>

                  <td className="px-4 py-3">
                    <Badge tone={u.role === "PROVIDER" ? "blue" : "zinc"}>{u.role}</Badge>
                  </td>

                  <td className="px-4 py-3">
                    {isProvider ? (
                      approved ? (
                        <Badge tone="green">Approved</Badge>
                      ) : (
                        <Badge tone="red">Pending</Badge>
                      )
                    ) : (
                      <Badge tone="zinc">N/A</Badge>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {isProvider ? (
                        approved ? (
                          <IconButton
                            disabled={actionBusy}
                            onClick={() => onRevoke(u._id)}
                            type="button"
                            title="Revoke approval"
                          >
                            Revoke
                          </IconButton>
                        ) : (
                          <IconButton
                            disabled={actionBusy}
                            onClick={() => onApprove(u._id)}
                            type="button"
                            title="Approve provider"
                          >
                            Approve
                          </IconButton>
                        )
                      ) : null}

                      <IconButton
                        disabled={actionBusy}
                        onClick={() => onDelete(u._id, fullName)}
                        type="button"
                        title="Delete user"
                      >
                        Delete
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                  No users match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
