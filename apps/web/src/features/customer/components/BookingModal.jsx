import { useMemo, useState } from "react";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toIsoFromParts({ dateStr, hour12, minute, ampm }) {
  // dateStr: YYYY-MM-DD (local)
  // hour12: "1".."12"
  // minute: "00".."59"
  // ampm: "AM"|"PM"
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  let h = Number(hour12);

  if (ampm === "AM" && h === 12) h = 0;
  if (ampm === "PM" && h !== 12) h += 12;

  const min = Number(minute);

  // Create local date and send as ISO (backend expects ISO string)
  const local = new Date(y, m - 1, d, h, min, 0, 0);
  return local.toISOString();
}

export default function BookingModal({ open, service, busy, onClose, onConfirm }) {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

  const [dateStr, setDateStr] = useState(defaultDate);
  const [hour12, setHour12] = useState("11");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  const canConfirm = useMemo(() => {
    if (!service?._id) return false;
    if (!dateStr) return false;
    const iso = toIsoFromParts({ dateStr, hour12, minute, ampm });
    const d = new Date(iso);
    return !Number.isNaN(d.getTime());
  }, [service, dateStr, hour12, minute, ampm]);

  if (!open) return null;

  const hours = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={busy ? undefined : onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-100">Book Service</h3>
        <p className="mt-1 text-sm text-zinc-400">
          You’re booking: <span className="text-zinc-200 font-medium">{service?.title}</span>
        </p>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200">Date</label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200">Time</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <select
                value={hour12}
                onChange={(e) => setHour12(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-700"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>

              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-700"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={ampm}
                onChange={(e) => setAmpm(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-700"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              This uses your local time and sends it to the backend as ISO.
            </p>
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
            disabled={busy || !canConfirm}
            onClick={() =>
              onConfirm({
                serviceId: service._id,
                date: toIsoFromParts({ dateStr, hour12, minute, ampm }),
              })
            }
            className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-60"
          >
            {busy ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
