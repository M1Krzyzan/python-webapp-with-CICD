import axios, { AxiosError } from "axios";

interface Client {
  email: string;
  payment_address: string;
  delivery_address: string;
  nip: string;
  orders: string;
  password: string;
  company_name: string;
}

const registerClients = () => {
  const addClient = async (clientData: Client): Promise<void> => {
    // Wypisanie danych w formacie obiektu
    console.log("Client data (Object):", clientData);

    // Konwersja danych do JSON i wypisanie
    const clientdata = JSON.stringify(clientData);
    console.log("Client data (JSON):", clientdata);

    try {
      // Wysyłanie danych JSON do serwera
      const response = await axios.post(
        "http://localhost:8000/api/register",
        clientdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Client registered successfully:", response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        // Wypisanie odpowiedzi błędu z serwera
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);
      } else {
        // Wypisanie ogólnego błędu
        console.error("Failed to register client:", error);
      }
      throw new Error("Could not register client");
    }
  };

  return { addClient };
};

export default registerClients;
