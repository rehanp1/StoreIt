import { useEffect } from "react";
import "./App.css";
import AuthLayout from "./layout/AuthLayout";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import DynamicPage from "./pages/DynamicPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./layout/RootLayout";
import { Toaster } from "./components/ui/toaster";
import useUserAccount from "./hooks/useUserAccount";
import RouteTracker from "./components/RouteTracker";
import Dashboard from "./pages/Dashboard";

function App() {
  const { isLoggedIn } = useUserAccount();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "StoreIt";
    const lastPath = localStorage.getItem("lastPath");

    if (lastPath && isLoggedIn) {
      navigate(lastPath);
    }
  }, []);

  return (
    <>
      <RouteTracker />
      <Routes>
        {!isLoggedIn && (
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
        )}

        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/:type" element={<DynamicPage />} />
          </Route>

          {/* if user try to navigate to auth urls while login then user will navigate to home url */}
          <Route path="/sign-up" element={<Navigate to="/" />} />
          <Route path="/sign-in" element={<Navigate to="/" />} />
        </Route>

        {/* handle not found route */}
        <Route path="*" element={<p>Not found page</p>} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
