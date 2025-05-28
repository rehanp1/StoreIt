import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
