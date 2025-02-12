import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Typography variant="h1">404 Not Found</Typography>
      <a href="/">Home Page</a>
    </Box>
  );
};

export default NotFound;