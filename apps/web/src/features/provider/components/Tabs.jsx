export default function Tabs({ value, onChange, tabs }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 p-1">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={[
              "px-3 py-1.5 text-sm rounded-lg transition",
              active
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-300 hover:text-white hover:bg-zinc-900",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
