import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface CartSummaryProps {
  totalPrice: number;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,
  onContinueShopping,
  onProceedToCheckout,
}) => {
  return (
    <Box sx={{ marginTop: "16px" }}>
      <Typography variant="h6" style={{ color: "black" }}>
        Całkowita cena: ${totalPrice.toFixed(2)}
      </Typography>
      <Box sx={{ marginTop: "16px" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: "8px" }}
          onClick={() => onContinueShopping()}
        >
          Kontynuuj zakupy
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onProceedToCheckout}
        >
          Przejdź do kasy
        </Button>
      </Box>
    </Box>
  );
};

export default CartSummary;
