import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import store, { persistor } from "../src/redux/store";
import App from "../src/App";

describe("Root Application", () => {
  it("renders the application without crashing", () => {
    const queryClient = new QueryClient();

    render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </PersistGate>
      </Provider>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});