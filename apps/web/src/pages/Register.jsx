import { useState } from "react";
import { register } from "../features/auth/authApi";

export default function Register({ onRegistered, goLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const data = await register({ name, email, password, role });
      onRegistered(data.user);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Register</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <label>Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>I'm a </label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="PROVIDER">PROVIDER</option>

            {/* cant set admin at fe */}
            {/* <option 
            value="ADMIN">ADMIN</option> */}
          </select>
        </div>

        {err && <p style={{ marginTop: 12 }}>{err}</p>}

        <button style={{ marginTop: 16 }} type="submit">
          Register
        </button>
      </form>

      <button style={{ marginTop: 12 }} onClick={goLogin}>
        Back to login
      </button>
    </div>
  );
}
