import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import useUserAccount from "@/hooks/useUserAccount";

import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { account } = useUserAccount();

  if (!account) return null;

  return (
    <main className="flex h-screen">
      <Sidebar {...account} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...account} />
        <Header />
        <div className="main-content">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default RootLayout;
