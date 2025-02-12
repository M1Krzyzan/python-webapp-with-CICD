import { Box, IconButton, TextField } from "@mui/material";
import React from "react";

interface QuantityInputProps {
  quantity: number;
  productID: string;
  handleQuantityChange: (id: string, quantity: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  productID,
  handleQuantityChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
      }}
    >
      <IconButton
        onClick={() => handleQuantityChange(productID, quantity - 1)}
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        -
      </IconButton>
      <TextField
        value={quantity}
        type="number"
        size="small"
        onChange={(e) =>
          handleQuantityChange(productID, parseInt(e.target.value, 10) || 1)
        }
        sx={{
          width: "50px",
          textAlign: "center",
          "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
          "& input": {
            padding: "8px",
            textAlign: "center",
          },
        }}
      />
      <IconButton
        onClick={() => handleQuantityChange(productID, quantity + 1)}
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        +
      </IconButton>
    </Box>
  );
};

export default QuantityInput;