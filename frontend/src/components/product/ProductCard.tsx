import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import QuantityInput from "../cart/QuantityInput.tsx";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  country_of_origin: string;
  description: string;
  fruit_or_vegetable: string;
  expiry_date: string;
  imageUrl?: string;
  onAddToCart: (quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  country_of_origin,
  description,
  fruit_or_vegetable,
  expiry_date,
  imageUrl,
  onAddToCart,
}) => {
  const [localQuantity, setLocalQuantity] = useState(1);

  const handleQuantityChange = (productID: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return; // Prevent the quantity from going below 1
    }
    setLocalQuantity(newQuantity); // Update local quantity
  };

  const handleAddToCart = () => {
    onAddToCart(localQuantity); // Add the product to the cart
    setLocalQuantity(1); // Reset the quantity to 1 after adding to the cart
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageUrl || "https://via.placeholder.com/150"}
        alt={name}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Country of origin: {country_of_origin}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {fruit_or_vegetable}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expiration date: {new Date(expiry_date).toLocaleDateString()}
        </Typography>
        <Typography variant="h6" color="text.primary">
          Price: {price} zł/kg
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "16px",
            justifyContent: "space-evenly",
          }}
        >
          <QuantityInput
            quantity={localQuantity} // Pass localQuantity to QuantityInput
            productID={id}
            handleQuantityChange={handleQuantityChange}
          />
          <Button
            className="add-to-cart"
            onClick={handleAddToCart}
            variant="contained"
            sx={{ backgroundColor: "#177c1b" }}
          >
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;