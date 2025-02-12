import React from "react";
import {Typography} from "@mui/material";
import QuantityInput from "./QuantityInput.tsx";
import {CartItemModel} from "../../model/cardItem.ts";

// Define the interface for the cart item
interface CartItemProps {
  item: CartItemModel;
  handleQuantityChange: (id: string, quantity: number) => void;
}

const currency: string = "zł";

const CartItem: React.FC<CartItemProps> = ({ item, handleQuantityChange }) => {
  return (
    <div
      key={item.id}
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr 1fr 1fr",
        gap: "1rem",
        alignItems: "center",
        padding: "1rem 0",
      }}
    >
      <div>
        <img
          src={item.photo}
          alt={item.name}
          width={100}
          height={100}
          style={{ objectFit: "cover", borderRadius: "8px" }} // Optional: Add styling
        />
        <Typography>{item.name}</Typography>
      </div>
      <QuantityInput
        productID={item.id}
        quantity={item.quantity}
        handleQuantityChange={handleQuantityChange}
      />
      <Typography sx={{ textAlign: "center" }}>
        {item.price.toFixed(2)} {currency}
      </Typography>
      <Typography sx={{ textAlign: "center" }}>
        {(item.quantity * item.price).toFixed(2)} {currency}
      </Typography>
    </div>
  );
};

export default CartItem;
