import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ShoppingCartMiniature = () => {
  // Select cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Calculate total quantity of items in the cart
  const totalQuantity = cartItems.length;

  return (
    <div style={{ margin: "auto" }}>
      <Link to="/cart" className="cart">
        <Badge
          badgeContent={totalQuantity} // Dynamic quantity from Redux store
          color="secondary"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "1rem",
              height: "1.2rem",
              minWidth: "1.2rem",
              transform: "translate(-25%, 25%)",
              backgroundColor: "#ea2323",
              color: "white",
            },
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: "2.5rem", color: "#177c1b" }} />
        </Badge>
      </Link>
    </div>
  );
};

export default ShoppingCartMiniature;