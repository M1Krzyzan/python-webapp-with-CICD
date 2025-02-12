import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import store from "../src/redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
const queryClient = new QueryClient();
describe("App", () => {
  it("renders the Home page on default route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Country of origin/i)).toBeInTheDocument(); // Replace with a unique element in `Home`
  });

  it("renders the About page on /about route", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/About us/i)).toBeInTheDocument(); // Replace with a unique element in `About`
  });

  it("renders the Contact page on /contact route", () => {
    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Do you/i)).toBeInTheDocument(); // Replace with a unique element in `Contact`
  });

  it("renders the Cart page on /cart route", () => {
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument(); // Replace with a unique element in `CartPage`
  });
  //
  // it("renders the Checkout page on /checkout route", () => {
  //   render(
  //     <MemoryRouter initialEntries={["/checkout"]}>
  //       <Provider store={store}>
  //         <QueryClientProvider client={queryClient}>
  //           <App />
  //         </QueryClientProvider>
  //       </Provider>
  //     </MemoryRouter>,
  //   );
  //
  //   expect(screen.getByText(/Checkout/i)).toBeInTheDocument(); // Replace with a unique element in `CheckoutPage`
  // });
  //
  // it("renders the Admin page on /admin route", () => {
  //   render(
  //     <MemoryRouter initialEntries={["/admin"]}>
  //       <Provider store={store}>
  //         <QueryClientProvider client={queryClient}>
  //           <App />
  //         </QueryClientProvider>
  //       </Provider>
  //     </MemoryRouter>,
  //   );
  //
  //   expect(screen.getByText(/Admin/i)).toBeInTheDocument(); // Replace with a unique element in `Admin`
  // });

  it("renders the Register page on /register route", () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Create account/i)).toBeInTheDocument(); // Replace with a unique element in `RegisterForm`
  });

  it("renders the Login page on /login route", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument(); // Replace with a unique element in `Login`
  });

  it("renders the NotFound page for an unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Not Found/i)).toBeInTheDocument(); // Replace with a unique element in `NotFound`
  });
});
