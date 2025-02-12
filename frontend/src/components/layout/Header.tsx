import React, { useEffect, useMemo } from "react";
import UserActionsWrapper from "./UserActionsWrapper.tsx";
import Logo from "./Logo.tsx";
import HeaderLink from "./HeaderLink.tsx";
import { getUserFromToken } from "../../auth/authService.ts";
import { UserRole } from "../../auth/UserRole.ts";

const Header: React.FC = () => {
  const user = useMemo(() => getUserFromToken(), []);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <header className="layout__header">
      <Logo />
      <div
        style={{
          display: "flex",
          color: "blue",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <HeaderLink to="/" text="Home" />
        <HeaderLink to="/contact" text="Contact" />
        <HeaderLink to="/about" text="About" />
        <HeaderLink to="/" text="Products" />
        {getUserFromToken()?.role === UserRole.ADMIN && (
          <HeaderLink to="/admin" text="Reports" />
        )}
      </div>
      <UserActionsWrapper user={user} />
    </header>
  );
};

export default Header;