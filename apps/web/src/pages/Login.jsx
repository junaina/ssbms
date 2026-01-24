import { useState } from "react";
import { login } from "../features/auth/authApi";

export default function Login({ onLoggedIn, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const data = await login({ email, password });
      onLoggedIn(data.user);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Login</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {err && <p style={{ marginTop: 12 }}>{err}</p>}

        <button style={{ marginTop: 16 }} type="submit">
          Login
        </button>
      </form>

      <button style={{ marginTop: 12 }} onClick={goRegister}>
        Create account
      </button>
    </div>
  );
}
