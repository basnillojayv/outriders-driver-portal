// Redirects to the V3 loading screen — kept as a named route for backward compat
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function V3Splash() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/home-v3", { replace: true }); }, []);
  return null;
}