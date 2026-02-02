import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../features/auth/authSlice";

export default function Login({ goRegister }) {
  const dispatch = useDispatch();
  const { error, status } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
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

        {error && <p style={{ marginTop: 12 }}>{error}</p>}

        <button style={{ marginTop: 16 }} type="submit" disabled={status === "loading"}>
          Login
        </button>
      </form>

      <button style={{ marginTop: 12 }} onClick={goRegister}>
        Create account
      </button>
    </div>
  );
}
