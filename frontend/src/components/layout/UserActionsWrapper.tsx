import React from "react";
import { Box } from "@mui/material";
import HeaderLink from "./HeaderLink.tsx";
import ShoppingCartMiniature from "./ShoppingCartMiniature.tsx";
import ProfilePhotoWrapper from "./ProfilePhotoWrapper.tsx";
import { LoggedInUser } from "../../auth/authService.ts";
import { UserRole } from "../../auth/UserRole.ts";

interface UsersActionWrapperProps {
  user?: LoggedInUser;
}

const UserActionsWrapper: React.FC<UsersActionWrapperProps> = ({ user }) => {
  return (
    <div className="icon__wrapper">
      <Box sx={{ display: "flex", gap: 2, height: "3rem" }}>
        {!user && (
          <>
            <HeaderLink to="/login" text="Login" />
            <HeaderLink to="/register" text="Register" />
          </>
        )}

        {user && <ProfilePhotoWrapper user={user} />}
        {(!user || user.role !== UserRole.ADMIN) && <ShoppingCartMiniature />}
      </Box>
    </div>
  );
};

export default UserActionsWrapper;