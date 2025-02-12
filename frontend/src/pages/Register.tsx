import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import registerClients from "../hooks/registerClients";
import { Client } from "../model/client.ts";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Link, useNavigate } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";

const RegisterForm = () => {
  const { addClient } = registerClients();
  const navigate = useNavigate(); // React Router hook for navigation

  const [email, setEmail] = useState<string>("");
  const [paymentAddressVoivodeship, setPaymentAddressVoivodeship] =
    useState<string>("");
  const [paymentAddressCity, setPaymentAddressCity] = useState<string>("");
  const [paymentAddressStreet, setPaymentAddressStreet] = useState<string>("");
  const [paymentAddressStreetNumber, setPaymentAddressStreetNumber] =
    useState<string>("");
  const [paymentAddressPostalCode, setPaymentAddressPostalCode] =
    useState<string>("");
  const [deliveryAddressVoivodeship, setDeliveryAddressVoivodeship] =
    useState<string>("");
  const [deliveryAddressCity, setDeliveryAddressCity] = useState<string>("");
  const [deliveryAddressStreet, setDeliveryAddressStreet] =
    useState<string>("");
  const [deliveryAddressStreetNumber, setDeliveryAddressStreetNumber] =
    useState<string>("");
  const [deliveryAddressPostalCode, setDeliveryAddressPostalCode] =
    useState<string>("");
  const [nip, setNip] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [company_name, setCompanyName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !email ||
      !paymentAddressVoivodeship ||
      !paymentAddressCity ||
      !paymentAddressStreet ||
      !paymentAddressStreetNumber ||
      !paymentAddressPostalCode ||
      !deliveryAddressVoivodeship ||
      !deliveryAddressCity ||
      !deliveryAddressStreet ||
      !deliveryAddressStreetNumber ||
      !deliveryAddressPostalCode ||
      !nip ||
      !password ||
      !company_name
    ) {
      setError("Please fill all of the fields");
      return;
    }

    setError("");

    const newClient: Client = {
      email,
      payment_address: {
        voivodeship: paymentAddressVoivodeship,
        city: paymentAddressCity,
        street: paymentAddressStreet,
        postal_code: paymentAddressPostalCode,
        house_number: paymentAddressStreetNumber,
      },
      delivery_address: {
        voivodeship: deliveryAddressVoivodeship,
        city: deliveryAddressCity,
        street: deliveryAddressStreet,
        postal_code: deliveryAddressPostalCode,
        house_number: deliveryAddressStreetNumber,
      },
      nip,
      password,
      company_name,
    };

    try {
      await addClient(newClient);
      setEmail("");
      setDeliveryAddressCity("");
      setDeliveryAddressPostalCode("");
      setDeliveryAddressStreet("");
      setDeliveryAddressStreetNumber("");
      setDeliveryAddressVoivodeship("");
      setPaymentAddressCity("");
      setPaymentAddressPostalCode("");
      setPaymentAddressStreet("");
      setPaymentAddressStreetNumber("");
      setPaymentAddressVoivodeship("");
      setNip("");
      setPassword("");
      setCompanyName("");
      navigate("/checkout"); // Navigate back to the previous URL
    } catch (error) {
      setError("There was an error while registering a client: " + error);
    }
  };

  return (
    <main style={{ overflowY: "scroll" }}>
      <Box
        style={{
          padding: "16px",
          color: "black",
          margin: "5dvh auto",
          maxWidth: "30rem",
          minWidth: "20rem",
        }}
      >
        <Box>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h3"
              gutterBottom
              style={{ color: "black", textAlign: "center" }}
              sx={{ paddingTop: "60px", marginBottom: "4rem" }}
            >
              Create account
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
              />

              <TextField
                label="NIP"
                variant="outlined"
                fullWidth
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                size="small"
              />

              <TextField
                label="Company Name"
                variant="outlined"
                fullWidth
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
                size="small"
              />
              <Accordion sx={{ marginTop: "1.2rem", borderRadius: ".25rem" }}>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1a-header"
                >
                  Payment Address
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      label="Voivodeship"
                      variant="outlined"
                      fullWidth
                      value={paymentAddressVoivodeship}
                      onChange={(e) =>
                        setPaymentAddressVoivodeship(e.target.value)
                      }
                      size="small"
                    />
                    <TextField
                      label="City"
                      variant="outlined"
                      fullWidth
                      value={paymentAddressCity}
                      onChange={(e) => setPaymentAddressCity(e.target.value)}
                      size="small"
                    />
                    <TextField
                      label="Street"
                      variant="outlined"
                      fullWidth
                      value={paymentAddressStreet}
                      onChange={(e) => setPaymentAddressStreet(e.target.value)}
                      size="small"
                    />
                    <TextField
                      label="Building Number"
                      variant="outlined"
                      fullWidth
                      value={paymentAddressStreetNumber}
                      onChange={(e) =>
                        setPaymentAddressStreetNumber(e.target.value)
                      }
                      size="small"
                    />

                    <TextField
                      label="Postal Code"
                      variant="outlined"
                      fullWidth
                      value={paymentAddressPostalCode}
                      onChange={(e) =>
                        setPaymentAddressPostalCode(e.target.value)
                      }
                      size="small"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{
                  marginTop: "1.9rem",
                  borderRadius: ".25rem",
                  marginBottom: ".8rem",
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1a-header"
                >
                  Delivery Address
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      label="Voivodeship"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddressVoivodeship}
                      onChange={(e) =>
                        setDeliveryAddressVoivodeship(e.target.value)
                      }
                      size="small"
                    />
                    <TextField
                      label="City"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddressCity}
                      onChange={(e) => setDeliveryAddressCity(e.target.value)}
                      size="small"
                    />
                    <TextField
                      label="Street"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddressStreet}
                      onChange={(e) => setDeliveryAddressStreet(e.target.value)}
                      size="small"
                    />
                    <TextField
                      label="Building Number"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddressStreetNumber}
                      onChange={(e) =>
                        setDeliveryAddressStreetNumber(e.target.value)
                      }
                      size="small"
                    />

                    <TextField
                      label="Postal Code"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddressPostalCode}
                      onChange={(e) =>
                        setDeliveryAddressPostalCode(e.target.value)
                      }
                      size="small"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
              />

              {error && (
                <Typography variant="body2" color="error" gutterBottom>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                className="register"
                variant="contained"
                sx={{ backgroundColor: "#388e3c", marginTop: "1rem" }}
                fullWidth
              >
                Register
              </Button>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "green",
                  marginTop: "1rem",
                }}
              >
                <WestIcon fontSize="small" /> Back to products
              </Link>
            </Stack>
          </form>
        </Box>
      </Box>
    </main>
  );
};

export default RegisterForm;
