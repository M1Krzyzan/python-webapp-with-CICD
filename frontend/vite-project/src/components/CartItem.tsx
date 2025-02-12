import React from "react";
import { Button, ListItem, ListItemText } from "@mui/material";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  removeFromCart: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  removeFromCart,
}) => {
  return (
    <ListItem
      sx={{
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <ListItemText
        style={{ color: "black" }}
        primary={`${name} x${quantity}`}
        secondary={`Cena: $${price.toFixed(2)} x${quantity}`}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => removeFromCart(id)}
        style={{ color: "black" }}
        sx={{
          border: "2px solid black",
          "&:hover": {
            backgroundColor: "red",
            borderColor: "red",
          },
          color: "black",
        }}
      >
        Usuń
      </Button>
    </ListItem>
  );
};

export default CartItem;
