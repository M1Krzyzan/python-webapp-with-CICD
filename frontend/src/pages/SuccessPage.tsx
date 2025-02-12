import React, { useEffect, useState } from "react";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../model/cardItem.ts";
import { clearCheckoutFormData } from "../model/checkoutFormData.ts";
import { clearOrderId } from "../model/order.ts";
import axios from "axios";
import { RootState } from "../redux/store.ts";
import { BACKEND_URL } from "../hooks/useProducts.ts";
import { getToken, setAuthorizationHeader } from "../auth/authService.ts";

const SuccessPage: React.FC = () => {
  const dispatch = useDispatch();
  const orderId = useSelector((state: RootState) => state.order.orderId);
  const [error, setError] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Clear the cart on mount
    useEffect(() => {
        const completeOrder = async () => {
            if (!orderId) {
                setError("Order ID not found");
                return;
            }

            try {
                const user = getToken();
                setAuthorizationHeader(user);

                // Wysyłamy pojedyncze zapytanie do backendu, które zajmuje się całą logiką zamówienia
                const response = await axios.put(`${BACKEND_URL}/api/orders/${orderId}/complete`);

                if (response.status === 200) {
                    // Backend potwierdza sukces – wykonujemy działania lokalne
                    setOrderCompleted(true);
                    dispatch(clearOrderId());
                    dispatch(clearCart());
                    dispatch(clearCheckoutFormData());
                } else {
                    setError("Failed to complete the order.");
                }
            } catch (error) {
                setError("Failed to complete the order.");
                console.error(error);
            }
        };

        if (orderId && !orderCompleted) {
            completeOrder();
        }
    }, []);


    return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: error ? "#8b0000" : "#177c1b", // Red for error, green for success
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          borderRadius: 4,
          boxShadow: 4,
        }}
      >
        <CardContent>
          {error ? (
            <>
              <ErrorOutlineIcon
                sx={{
                  fontSize: 60,
                  color: "#f44336", // Red icon for errors
                  marginBottom: 2,
                }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                color="#f44336"
                gutterBottom
              >
                Order Failed
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {error}
              </Typography>
            </>
          ) : orderCompleted ? (
            <>
              <CheckCircleIcon
                sx={{
                  fontSize: 60,
                  color: "#4caf50", // Green icon for success
                  marginBottom: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Order Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Thank you for your purchase! Your order has been placed
                successfully.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Completing your order...
              </Typography>
            </>
          )}
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "center",
            paddingBottom: 2,
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              backgroundColor: error ? "#f44336" : "#4caf50", // Red for error, green for success
              color: "#fff",
              borderRadius: 8,
              textTransform: "none",
              padding: "10px 20px",
            }}
          >
            Return to Home
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
};

export default SuccessPage;