import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  name: string;
  price: number;
  country_of_origin: string;
  description: string;
  fruit_or_vegetable: string;
  imageId: string;
  expiry_date: string;
}

interface ProductResponse {
  product?: Product;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get<ProductResponse>(
    "http://localhost:8000/api/products/67537e67b1e1ea00565c6e43",
  );
  return response.data.product ? [response.data.product] : [];
};

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        setError("Failed to fetch products: " + error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return { products, loading, error };
};

export default useProducts;
