import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "react-query";
import Sidebar from "../../../src/components/layout/Sidebar";

describe("Sidebar", () => {
  it("renders CheckBoxGroups for filters", () => {
    const store = configureStore({
      reducer: {
        products: () => ({
          filters: {
            fruitOrVegetable: [],
            countryOfOrigin: [],
          },
        }),
      },
    });

    // Create a new QueryClient instance for the test
    const queryClient = new QueryClient();

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Sidebar />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Country of origin")).toBeInTheDocument();
  });
});
