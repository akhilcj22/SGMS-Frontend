import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);


  const fallbackUser =
    user ||
    (() => {
      try {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    })();

  return fallbackUser ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
