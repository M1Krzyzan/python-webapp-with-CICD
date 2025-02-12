import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import ShoppingCartMiniature from "../../../src/components/layout/ShoppingCartMiniature";
import { MemoryRouter } from "react-router-dom";

describe("ShoppingCartMiniature", () => {
  it("displays total items in the cart", () => {
    // Create a mock Redux store
    const store = configureStore({
      reducer: {
        cart: () => ({
          items: Array(3).fill({ id: "1", quantity: 1 }), // Mock cart items
        }),
      },
    });

    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <ShoppingCartMiniature />
        </Provider>
      </MemoryRouter>,
    );

    // Check if "3" (total items) is displayed
    expect(getByText("3")).toBeInTheDocument();
  });
});