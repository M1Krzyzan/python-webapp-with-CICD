import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            "&:hover": {
              textDecoration: "none",
              color: "inherit",
            },
          }}
          onClick={() => handleNavigate("/")}
        >
          Hurtownia Owoców
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => handleNavigate("/cart")}>
            Koszyk
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/about")}>
            O nas
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/contact")}>
            Kontakt
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/login")}>
            Zaloguj się
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
