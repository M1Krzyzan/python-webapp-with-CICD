import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";
import { removeFromCart, updateCartItemQuantity } from "../model/cardItem.ts";
import WestIcon from "@mui/icons-material/West";
import CartItemsHeader from "../components/cart/CartItemsHeader.tsx";
import CartItem from "../components/cart/CartItem.tsx";
import { TOKEN_KEY } from "../auth/authService.ts";

const CheckoutPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items); // Access Redux state
  const dispatch = useDispatch();
  const currency: string = "zł";

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      return dispatch(updateCartItemQuantity({ id, quantity }));
    }
    return dispatch(removeFromCart(id));
  };

  // Calculate the total price from the Redux cart items
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <Box
      sx={{
        minHeight: "calc(70vh - 6rem)",
        padding: "50px",
        color: "black",
        margin: "8dvh auto",
        maxWidth: "50rem",
        minWidth: "30rem",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "lightgray solid .1rem",
          paddingBottom: "1.5rem",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 550 }}>
          Shopping Cart
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 550 }}>
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </Typography>
      </div>
      <CartItemsHeader />

      {cartItems.length === 0 ? ( // Check the Redux cart items
        <Typography>Your cart is empty</Typography>
      ) : (
        <div style={{ maxHeight: "33dvh", overflowY: "scroll" }}>
          {cartItems.map((item) => (
            <CartItem
              item={item}
              handleQuantityChange={handleQuantityChange}
              key={item.id}
            ></CartItem>
          ))}
        </div>
      )}
      <Typography variant="h6" sx={{ marginTop: "1rem", textAlign: "right" }}>
        Total: {totalPrice.toFixed(2)} {currency}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "green",
          }}
        >
          <WestIcon fontSize="small" /> Continue Shopping
        </Link>
        <Button
          component={Link} // Use Link as the underlying component
          to={localStorage.getItem(TOKEN_KEY) ? "/checkout" : "/login"}
          variant="contained"
          sx={{
            backgroundColor: "green",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;