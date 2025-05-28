import { avatarPlaceholderUrl, navItems } from "@/constants";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface Props {
  fullName: string;
  email: string;
}

const Sidebar = ({ fullName, email }: Props) => {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
      <Link to="/">
        <img
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={150}
          height={50}
          className="hidden h-auto lg:block"
        />
        <img
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-4">
          {navItems.map(({ name, icon, url }) => (
            <Link key={name} to={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
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
                <p className="hidden lg:block text-sm">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <div className="flex">
        <img
          src="/assets/images/files-2.png"
          alt="files-img"
          width={506}
          height={418}
          className="w-full lg:w-[50%]"
        />
        <img
          src="/assets/images/files-2.png"
          alt="files-img"
          width={506}
          height={418}
          className="w-full hidden lg:block lg:w-[50%]"
        />
      </div>

      <div className="sidebar-user-info">
        <img
          src={avatarPlaceholderUrl}
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />

        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
