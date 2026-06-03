import { Navigate } from "react-router-dom";

function Home() {
  const isLogin = localStorage.getItem("isLogin") === "true";
  const role = localStorage.getItem("role");

  if (!isLogin) return <Navigate to="/login" replace />;

  if (role === "parent") return <Navigate to="/dashboard" replace />;

  return <Navigate to="/login" replace />;
}

export default Home;