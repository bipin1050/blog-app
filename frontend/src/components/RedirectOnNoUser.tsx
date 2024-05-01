import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface Props {
  children: React.ReactNode;
}

export default function RedirectOnNoUser({ children }: Props) {
  const { pathname, search } = useLocation();
  const { username } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) navigate("/" + "?next=" + pathname + search);
  }, []);

  return username ? children : null;
}
