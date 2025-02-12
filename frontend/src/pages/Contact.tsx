import React from "react";
import { Box, Typography } from "@mui/material";

const Contact: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 6rem)",
          backgroundColor: "#e8f5e9",
        }}
      >
        <Box
          sx={{
            padding: "2rem",
            maxWidth: "800px",
            width: "90%",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "#388e3c",
              marginBottom: "1rem",
            }}
          >
            Contact
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: "1.8",
              color: "#4a4a4a",
              marginBottom: "1rem",
            }}
          >
              Do you have questions? Contact us at: kontakt@naszafirma.pl
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Contact;