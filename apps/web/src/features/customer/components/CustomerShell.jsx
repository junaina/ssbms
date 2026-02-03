export default function CustomerShell({ title, subtitle, right, children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
          </div>
          {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-4 sm:p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
