import React, { useState } from "react";
import { Box, Typography, List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";

interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItemType[]>([
    { id: "1", name: "Produkt 1", price: 29.99, quantity: 2 },
    { id: "2", name: "Produkt 2", price: 19.99, quantity: 1 },
  ]);

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleContinueShopping = () => {
    navigate("/");
    console.log("Kontynuuj zakupy");
  };

  const handleProceedToCheckout = () => {
    console.log("Przejdź do kasy");
  };

  return (
    <Box sx={{ padding: "16px" }} style={{ color: "black" }}>
      <Typography variant="h4" gutterBottom>
        Koszyk
      </Typography>
      {cart.length === 0 ? (
        <Typography>Twój koszyk jest pusty</Typography>
      ) : (
        <List>
          {cart.map((item) => (
            <CartItem
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </List>
      )}
      <CartSummary
        totalPrice={getTotalPrice()}
        onContinueShopping={handleContinueShopping}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </Box>
  );
};

export default CartPage;
