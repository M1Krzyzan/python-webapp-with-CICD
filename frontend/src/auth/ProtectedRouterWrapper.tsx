import React, { useEffect, useMemo } from "react";

import { UserRole } from "./UserRole";
import {
  checkTokenValidity,
  getUserFromToken,
  LoggedInUser,
} from "./authService";
import { useCustomNavigation } from "../hooks/useCustomNavigation.ts";
import useUnauthorizedRedirect from "../hooks/useUnathorizedRedirect.tsx";
import Login from "../pages/Login.tsx";

type ProtectedRouteWrapperProps = {
  allowedRoles: UserRole[];
  children: React.ReactElement;
};

export const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({
  allowedRoles,
  children,
}) => {
  const user: LoggedInUser | undefined = useMemo(() => getUserFromToken(), []);

  const { navigateToLoginPage } = useCustomNavigation();

  useEffect(() => {
    // Start token validity checking loop.
    checkTokenValidity(navigateToLoginPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add axios interceptor for 401 responses.
  useUnauthorizedRedirect();

  const hasValidRole: boolean = useMemo(() => {
    if (!user) {
      navigateToLoginPage();
      return false;
    }
    return allowedRoles.includes(user?.role as UserRole);
  }, [navigateToLoginPage, allowedRoles, user]);

  if (!hasValidRole) {
    return <Login />;
  }

  return children;
};

export const EnsureAuth = () => {};