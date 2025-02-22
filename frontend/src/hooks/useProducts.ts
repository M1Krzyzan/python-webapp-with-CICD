import {useQuery} from "react-query";
import axios from "axios";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  country_of_origin: string;
  fruit_or_vegetable: string;
  expiry_date: string;
  file: string;
  is_vegetable: string;
}

let config = { backendUrl: "http://localhost:8002" }; // Default value

export const loadConfig = async () => {
  try {
    const response = await fetch("/config.json");
    config = await response.json(); // Store the config globally
  } catch (error) {
    console.error("Failed to load config.json, using defaults", error);
  }
};

export const BACKEND_URL = () => config.backendUrl;

const fetchProductsFromApi = async (): Promise<Product[]> => {
  const response = await axios.get<{ products: Product[] }>(
    `${BACKEND_URL}/api/products`,
  );
  if (!response.data.products) {
    throw new Error("Products not found in the response");
  }
  return response.data.products.map((product) => ({
    ...product,
    fruit_or_vegetable: product["is_vegetable"] ? "Vegetable" : "Fruit",
  }));
};

export const useProducts = () => {
  return useQuery("products", fetchProductsFromApi);
};