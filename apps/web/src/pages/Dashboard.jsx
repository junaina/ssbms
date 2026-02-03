import AdminDashboard from "./AdminDashboard";
import ProviderDashboard from "./ProviderDashboard";
import CustomerDashboard from "./CustomerDashboard";
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

export default function Dashboard({ user, onLoggedOut }) {
  if (user?.role === "ADMIN") return <AdminDashboard me={user} />;

  if (user?.role === "PROVIDER") {
    return <ProviderDashboard me={user} onLoggedOut={onLoggedOut} />;
  }

  return <CustomerDashboard me={user} onLoggedOut={onLoggedOut} />;
}
