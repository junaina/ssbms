import { logout } from "../features/auth/authApi";

export default function Dashboard({ user, onLoggedOut }) {
  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>Dashboard</h2>
      <p>
        Logged in as <b>{user.name}</b> ({user.email})
      </p>
      <p>
        Role: <b>{user.role}</b>
      </p>
      <p>
        Approved: <b>{String(user.isApproved)}</b>
      </p>

      <button
        onClick={() => {
          logout();
          onLoggedOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}
