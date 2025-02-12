import axios, { AxiosError } from "axios";
import { Client } from "../model/client.ts";
import { saveToken } from "../auth/authService.ts";

const registerClients = () => {
  const addClient = async (clientData: Client): Promise<void> => {
    console.log("Registering client:", clientData);
    try {
      const response = await axios.post(
        "http://localhost:8002/api/register",
        JSON.stringify(clientData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const token = response.data.token; // Assuming the token is returned in `response.data.token`
      if (token) {
        saveToken(token); // Save the token and set it for subsequent requests
      }
      console.log("Client registered successfully:", response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);
      } else {
        console.error("Failed to register client:", error);
      }
      throw new Error("Could not register client");
    }
  };

  return { addClient };
};

export default registerClients;