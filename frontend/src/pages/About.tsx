import React from "react";
import { Box, Typography } from "@mui/material";

const About: React.FC = () => {
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
            About Us
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
            Welcome to our marketplace! We specialize in providing the freshest
            and highest quality fruits and vegetables to private businesses. Our
            mission is to bring nature's finest produce directly to your
            doorstep, ensuring your business thrives with the best products.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              lineHeight: "1.6",
              color: "#4a4a4a",
            }}
          >
            With a commitment to excellence, sustainability, and customer
            satisfaction, we take pride in being a trusted partner for
            businesses that value quality and reliability. Let's grow together!
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default About;