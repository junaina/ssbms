import { useEffect, useState } from "react";
import { me } from "./authApi";
import { getToken } from "../../lib/http";

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    setLoading(true);

    try {
      // If no token, we’re not logged in
      if (!getToken()) {
        setUser(null);
        return;
      }

      const data = await me();
      setUser(data.user);
    } catch (e) {
      // token bad/expired -> treat as logged out
      setUser(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { user, setUser, loading, error, refresh };
}
