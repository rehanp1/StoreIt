import type { FormEvent } from "react";
import FileUploader from "./FileUploader";
import Search from "./Search";
import { Button } from "./ui/button";
import useUserAccount from "@/hooks/useUserAccount";
import { signOut } from "@/services/auth.service";

const Header = () => {
  const { account, setAccount, setIsLoggedIn, filesSummary } = useUserAccount();

  const handleSignOut = async (e: FormEvent) => {
    e.preventDefault();

    const data = await signOut();

    if (data.success) {
      setAccount(null);
      setIsLoggedIn(false);
    }
  };

  if (!account) return null;

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader {...account} filesSummary={filesSummary} />
        <form onSubmit={handleSignOut}>
          <Button type="submit" className="sign-out-button">
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
