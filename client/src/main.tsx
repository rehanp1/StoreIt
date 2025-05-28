import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserAccountProvider } from "./context/UserAccountContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <UserAccountProvider>
      <App />
    </UserAccountProvider>
  </BrowserRouter>
);
