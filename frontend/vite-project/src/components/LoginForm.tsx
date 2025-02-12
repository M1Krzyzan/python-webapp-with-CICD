import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Walidacja
    if (!email || !password) {
      setError("Proszę wypełnić wszystkie pola");
      return;
    }

    setError("");
    console.log("Zalogowano:", { email, password });
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <Container>
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
          label="Hasło"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Zaloguj się
        </Button>
      </form>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: "16px" }}
        onClick={handleRegisterRedirect}
      >
        Zarejestruj się
      </Button>
    </Container>
  );
};

export default LoginForm;
