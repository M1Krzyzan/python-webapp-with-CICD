import { LoggedInUser } from "../../auth/authService.ts";
import { red } from "@mui/material/colors";
import Popover from "@mui/material/Popover";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProfilePhotoWrapperProps {
  user: LoggedInUser;
}

const ProfilePhotoWrapper: React.FC<ProfilePhotoWrapperProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  // Function to handle clicking the profile photo button
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle closing the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle the sign-out action
  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

    // Navigate to the login page
    navigate("/login");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <button
        className="photo__wrapper"
        style={{
          backgroundColor: red[500],
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          fontSize: "18px",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        {user.email ? user.email[0].toUpperCase() : "U"}
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          marginTop: "1.3rem",
          borderRadius: "1rem",
        }}
      >
        <button
          className="sign__out__button"
          onClick={handleSignOut}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "red",
            cursor: "pointer",
            padding: "1rem",
            fontSize: "16px",
          }}
        >
          Sign out
        </button>
      </Popover>
    </>
  );
};

export default ProfilePhotoWrapper;