import AdminDashboard from "./AdminDashboard";

function Placeholder({ title, subtitle }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="text-sm text-zinc-300">
            This dashboard will be wired after backend modules are done.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ user }) {
  if (user?.role === "ADMIN") return <AdminDashboard me={user} />;

  if (user?.role === "PROVIDER") {
    return (
      <Placeholder
        title="Provider Dashboard"
        subtitle={
          user?.isApproved
            ? "Provider features will be enabled once Service + Booking backend is complete."
            : "Your provider account is pending approval. Contact admin."
        }
      />
    );
  }

  return (
    <Placeholder
      title="Customer Dashboard"
      subtitle="Customer features will be enabled once Services browsing + Bookings backend is complete."
    />
  );
}
