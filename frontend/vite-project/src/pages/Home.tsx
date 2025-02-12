import useProducts from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const ProductsList: React.FC = () => {
  const { products, loading, error } = useProducts();

  const categories = ["Wszystko"];

  if (loading) return <div style={{ color: "black" }}>Ładowanie...</div>;
  if (error) return <div style={{ color: "black" }}>{error}</div>;

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: "10%",
          borderRight: "1px solid #ddd",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          backgroundColor: "white",
          marginTop: "16px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "black",
            marginBottom: "8px",
            paddingTop: "45px",
          }}
        >
          Kategorie
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              button
              key={category}
              sx={{
                padding: "8px 0",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              <ListItemText
                primary={category}
                sx={{
                  color: "black",
                  textAlign: "center",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ width: "100%", padding: "16px" }}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price}
              country_of_origin={product.country_of_origin}
              description={product.description}
              fruit_or_vegetable={product.fruit_or_vegetable}
              imageId={product.imageId}
              expiry_date={product.expiry_date}
              onAddToCart={() => console.log("Product added to cart")}
            />
          ))
        ) : (
          <p>
            Expected an array of products, but received:{" "}
            {JSON.stringify(products)}
          </p>
        )}
      </Box>
    </Box>
  );
};

export default ProductsList;
