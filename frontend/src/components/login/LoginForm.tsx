import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCustomNavigation } from "../../hooks/useCustomNavigation.ts";
import { getUserFromToken, TOKEN_KEY } from "../../auth/authService.ts";
import WestIcon from "@mui/icons-material/West";

const LoginForm = () => {
  const { navigateToHome } = useCustomNavigation();
  const token = localStorage.getItem(TOKEN_KEY);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigateToHome();
    }
  }, [navigateToHome, token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://127.0.0.1:8002/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token } = response.data;
      const tokenPayload = JSON.parse(
        atob(access_token.split(".")[1]), // Decode JWT payload
      );
      const role = tokenPayload.role;

      // Store the token and role in localStorage
      localStorage.setItem(TOKEN_KEY, access_token);
      console.log(getUserFromToken());
      localStorage.setItem("user_role", role);
      localStorage.setItem("fullname", response.data.fullname);
      navigateToHome();
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Box>
        <Button
          type="submit"
          className="login"
          variant="contained"
          color="primary"
          sx={{ marginTop: "1rem" }}
          fullWidth
        >
          Login
        </Button>
        <Button
          type="button"
          className="register"
          onClick={handleRegisterRedirect}
          variant="contained"
          sx={{ backgroundColor: "#388e3c", marginTop: "1rem" }}
          fullWidth
        >
          Register
        </Button>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "green",
            marginTop: "1rem",
          }}
        >
          <WestIcon fontSize="small" /> Back to products
        </Link>
      </Box>
    </form>
  );
};

export default LoginForm;