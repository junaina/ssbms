import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../features/auth/authSlice";

export default function Register({ goLogin }) {
  const dispatch = useDispatch();
  const { error, status } = useSelector((s) => s.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  function onSubmit(e) {
    e.preventDefault();
    dispatch(registerThunk({ firstName, lastName, email, password, role }));
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
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="PROVIDER">PROVIDER</option>
          </select>
        </div>

        {error && <p style={{ marginTop: 12 }}>{error}</p>}

        <button style={{ marginTop: 16 }} type="submit" disabled={status === "loading"}>
          Register
        </button>
      </form>

      <button style={{ marginTop: 12 }} onClick={goLogin}>
        Back to login
      </button>
    </div>
  );
}
