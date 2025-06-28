import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import useUserAccount from "@/hooks/useUserAccount";
import { signOut } from "@/services/auth.service";

interface Props {
  id: string;
  fullName: string;
  email: string;
}

const MobileNavigation = ({ id, fullName, email }: Props) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { setAccount, setIsLoggedIn, filesSummary } = useUserAccount();

  const handleSignOut = async () => {
    const data = await signOut();
    if (data?.success) {
      setAccount(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <header className="mobile-header">
      <img
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <img src="/assets/icons/menu.svg" alt="menu" width={23} height={23} />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <img
                src={avatarPlaceholderUrl}
                alt="Avatat"
                width={44}
                height={44}
                className="header-user-avatar"
              />

              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/40" />
          </SheetTitle>

          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ name, icon, url }) => (
                <Link key={name} to={url} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === url && "shad-active"
                    )}
                  >
                    <img
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        pathname === url && "nav-icon-active"
                      )}
                    />
                    <p className="text-sm">{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/30" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader
              id={id}
              fullName={fullName}
              email={email}
              filesSummary={filesSummary}
            />
            <Button
              onClick={handleSignOut}
              type="submit"
              className="mobile-sign-out-button"
            >
              <img
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
