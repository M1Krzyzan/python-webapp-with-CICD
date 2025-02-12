import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../../../src/components/layout/Header";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

describe("Header", () => {
  const mockStore = configureStore({
    reducer: {
      cart: () => ({
        items: [], // Minimal shape: your slice expects `items`
      }),
    },
  });
  it("renders logo and navigation links", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <Header />
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Food Market")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });
});