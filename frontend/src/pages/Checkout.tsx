import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "../redux/store.ts";
import WestIcon from "@mui/icons-material/West";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useMutation, useQuery } from "react-query";
import {
  AddressDetails,
  fetchUnavailableDates,
  OrderDetails,
  OrderProductDetails,
  placeOrder,
} from "../api/ordersApi.ts";
import { getUserFromToken } from "../auth/authService.ts";
import { updateCheckoutFormData } from "../model/checkoutFormData.ts";
import { setOrderId } from "../model/order.ts";

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch();

  // Get cart items and persisted checkout data from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const checkoutData = useSelector(
    (state: RootState) =>
      state.checkoutFormData?.formData ?? {
        voivodeship: "",
        city: "",
        street: "",
        house_number: "",
        postal_code: "",
        delivery_date: null,
      },
  );
  const currency: string = "zł";

  // Initialize form state with data from Redux Persist (if available)
  const [shippingAddress, setShippingAddress] = useState({
    voivodeship: checkoutData?.voivodeship || "",
    city: checkoutData?.city || "",
    street: checkoutData?.street || "",
    houseNumber: checkoutData?.house_number || "",
    postalCode: checkoutData?.postal_code || "",
  });

  const [deliveryDate, setDeliveryDate] = useState<Date | null>(
    checkoutData?.delivery_date || null,
  );

  const [errors, setErrors] = useState({
    voivodeship: "",
    city: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    deliveryDate: "",
    amount_err: "",
  });

  const { data: busyDaysData } = useQuery("busyDays", fetchUnavailableDates, {
    staleTime: 60000,
  });

  const busyDays =
    busyDaysData?.dates?.map((dateStr: string) => new Date(dateStr)) || [];

  const isDayDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today to ignore the time component

    // Disable past dates
    if (date < today) {
      return true;
    }

    // Disable busy days
    return busyDays.some(
      (busyDay) =>
        busyDay.getDate() === date.getDate() &&
        busyDay.getMonth() === date.getMonth() &&
        busyDay.getFullYear() === date.getFullYear(),
    );
  };

  const validateFields = () => {
    const postalCodeRegex = /^[0-9]{2}-[0-9]{3}$/;

    const newErrors = {
      voivodeship: shippingAddress.voivodeship ? "" : "Voivodeship is required",
      street: shippingAddress.street ? "" : "Street is required",
      city: shippingAddress.city ? "" : "City is required",
      postalCode: shippingAddress.postalCode
        ? postalCodeRegex.test(shippingAddress.postalCode)
          ? ""
          : "Invalid postal code format (e.g., 12-345)"
        : "Postal code is required",
      houseNumber: shippingAddress.houseNumber
        ? ""
        : "House number is required",
      deliveryDate: deliveryDate ? "" : "Delivery date is required",
      amount_err: totalPrice >= 50 ? "" : "Total price must be at least 50 zł",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const [orderError, setOrderError] = useState<string | null>(null);
  const { mutate: placeOrderMutation, isLoading } = useMutation(placeOrder, {
    onSuccess: (data) => {
      // Save the order ID to Redux for persistence
      dispatch(setOrderId(data.order.id));

      if (data.url) {
        persistor.flush().then(() => {
          // Teraz przekieruj do Stripe
          window.location.href = data.url;
        });
      } else {
        console.error("Redirect URL not found in the response.");
        setOrderError("Redirect URL not found. Please contact support.");
      }

      setOrderError(null);
    },
    onError: (error) => {
      console.error("Error placing order:", error);
      setOrderError("Failed to place order. Please try again.");
    },
  });

  const handleOrderPlacement = () => {
    // Validate fields before proceeding
    if (!validateFields()) {
      console.error("Validation failed: Fields are missing or incorrect");
      return;
    }

    // Map cart items to match the backend API structure
    const mappedCartItems: OrderProductDetails[] = cartItems.map((item) => ({
      product_id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    }));

    // Prepare the shipping address
    const mappedShippingAddress: AddressDetails = {
      voivodeship: shippingAddress.voivodeship,
      street: shippingAddress.street,
      city: shippingAddress.city,
      house_number: shippingAddress.houseNumber,
      postal_code: shippingAddress.postalCode,
    };

    // Get the user information (e.g., email)
    const user = getUserFromToken();

    // Construct the order details payload
    const orderDetails: OrderDetails = {
      delivery_date: deliveryDate!,
      amount: parseFloat(totalPrice.toFixed(2)), // Convert to number with 2 decimals
      products: mappedCartItems,
      delivery_address: mappedShippingAddress,
      email: user?.email || "No Email",
    };

    // Save to Redux Persist before placing the order
    dispatch(
      updateCheckoutFormData({
        voivodeship: mappedShippingAddress.voivodeship,
        city: mappedShippingAddress.city,
        street: mappedShippingAddress.street,
        house_number: mappedShippingAddress.house_number,
        postal_code: mappedShippingAddress.postal_code,
        delivery_date: orderDetails.delivery_date,
      }),
    );

    // Trigger the mutation to place the order
    placeOrderMutation(orderDetails);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <Box
      sx={{
        padding: "50px",
        color: "black",
        margin: "10dvh auto",
        maxWidth: "50rem",
        minWidth: "30rem",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: "1.5rem" }}>
        Checkout
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Order Summary
          </Typography>
          <Box
            sx={{
              maxHeight: "20dvh",
              overflowY: "auto",
              marginBottom: "2rem",
              border: "1px solid lightgray",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            {cartItems.map((item) => (
              <Typography key={item.id}>
                {item.name} - {item.quantity} x {item.price} {currency}
              </Typography>
            ))}
          </Box>

          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Shipping Address
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Voivodeship"
              name="voivodeship"
              value={shippingAddress.voivodeship}
              onChange={handleInputChange}
              error={!!errors.voivodeship}
              helperText={errors.voivodeship}
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={shippingAddress.city}
              onChange={handleInputChange}
              error={!!errors.city}
              helperText={errors.city}
            />
            <Stack direction="row" spacing={3}>
              <TextField
                fullWidth
                label="Street"
                name="street"
                value={shippingAddress.street}
                onChange={handleInputChange}
                error={!!errors.street}
                helperText={errors.street}
              />
              <TextField
                fullWidth
                label="House Number"
                name="houseNumber"
                value={shippingAddress.houseNumber}
                onChange={handleInputChange}
                error={!!errors.houseNumber}
                helperText={errors.houseNumber}
              />
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
                error={!!errors.postalCode}
                helperText={errors.postalCode}
              />
            </Stack>
          </Stack>

          <Typography
            variant="h6"
            sx={{ marginTop: "2rem", marginBottom: "1rem" }}
          >
            Select Delivery Date
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={deliveryDate}
              onChange={(newValue) => setDeliveryDate(newValue)}
              shouldDisableDate={isDayDisabled}
            />
          </LocalizationProvider>
          {errors.deliveryDate && (
            <Typography color="red">Delivery date is required</Typography>
          )}

          <Typography variant="h6" sx={{ marginTop: "2rem", fontWeight: 600 }}>
            Total Price: {totalPrice.toFixed(2)} {currency}
          </Typography>
          {errors.amount_err && (
            <Typography color="red" sx={{ marginTop: "0.5rem" }}>
              {errors.amount_err}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
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
            {orderError && (
              <Typography color="error" sx={{ marginTop: "1rem" }}>
                {orderError}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOrderPlacement}
              disabled={isLoading}
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutPage;