import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../contexts/UserContext";
import Loading from "./Loading";

interface Props {
  children: React.ReactNode;
}

export default function RedirectOnAuthSuccess({ children }: Props) {
  const { id, email, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async (signal: AbortSignal) => {
    if (id && email) return navigate("/");
    try {
      setLoading(true);
      const response = await fetch("/api/users/current/", { signal });
      if (response.ok) {
        const data = await response.json();
        setUser(
          data.id,
          data.username,
          data.email,
          data.first_name || undefined,
          data.last_name || undefined
        );
        setLoading(false);
        navigate("/");
      } else {
        setLoading(false);
      }
    } catch (reason) {
      console.log(reason);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller.signal);
    return () => controller.abort();
  }, []);

  if (loading) return <Loading />;
  return <>{children}</>;
}
