import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductsList from "../../src/pages/ProductsList";
import { useProducts } from "../../src/hooks/useProducts";

// Mock the `useProducts` hook
jest.mock("../../src/hooks/useProducts", () => ({
  useProducts: jest.fn(),
}));

describe("ProductsList", () => {
  const mockStore = configureStore({
    reducer: {
      products: () => ({
        filters: {
          fruitOrVegetable: [],
          countryOfOrigin: [],
        },
      }),
    },
  });

  it("renders loading state", () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(
      <Provider store={mockStore}>
        <ProductsList />
      </Provider>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Failed to fetch products"),
    });

    render(
      <Provider store={mockStore}>
        <ProductsList />
      </Provider>,
    );

    expect(
      screen.getByText(/error: failed to fetch products/i),
    ).toBeInTheDocument();
  });

  it("renders list of products", () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: [
        {
          id: "1",
          name: "Apple",
          price: 2.5,
          country_of_origin: "USA",
          description: "Fresh apple",
          fruit_or_vegetable: "fruit",
          expiry_date: "2025-01-01",
          file: "apple.jpg",
        },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={mockStore}>
        <ProductsList />
      </Provider>,
    );

    expect(screen.getByText(/Apple/)).toBeInTheDocument(); // Check for product name
  });
});
