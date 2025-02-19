import { useState, useEffect } from "react";
import axios from "axios";
import {BACKEND_URL} from "../../../src/hooks/useProducts";

interface Client {
  email: string;
  payment_address: string[];
  delivery_address: string[];
  nip: string;
  orders: string[];
  password: string;
  company_name: string;
}

const fetchClients = async (): Promise<Client[]> => {
  try {
    const response = await axios.get<Client[]>(
      `${BACKEND_URL}/api/clients`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    throw new Error("Could not fetch clients");
  }
};

const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (error) {
        setError("Failed to fetch clients: " + error);
      } finally {
        setLoading(false);
      }
    };

    getClients();
  }, []);

  return { clients, loading, error };
};

export default useClients;
