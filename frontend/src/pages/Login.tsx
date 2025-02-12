import React from "react";
import LoginForm from "../components/login/LoginForm.tsx";
import { Box } from "@mui/material";

const Login = () => {
  return (
    <Box
      sx={{
        padding: "16px",
        color: "black",
        margin: "20dvh auto",
        maxWidth: "30rem",
        minWidth: "20rem",
      }}
    >
      <Box>
        <h1 style={{ color: "black" }}>Sign in</h1>
        <LoginForm />
      </Box>
    </Box>
  );
};

export default Login;