import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meThunk, logout as logoutAction } from "./features/auth/authSlice";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const dispatch = useDispatch();
  const { user, token, status } = useSelector((s) => s.auth);
  const [page, setPage] = useState("login");
  useEffect(() => {
    if (token) dispatch(meThunk());
  }, [token, dispatch]);
  if (status == "loading") return <div style={{ padding: 24 }}>Loading...</div>;
  if (user) {
    return <Dashboard user={user} onLoggedOut={() => dispatch(logoutAction())} />;
  }
  return page === "register" ? (
    <Register goLogin={() => setPage("login")} />
  ) : (
    <Login goRegister={() => setPage("register")} />
  );
}
