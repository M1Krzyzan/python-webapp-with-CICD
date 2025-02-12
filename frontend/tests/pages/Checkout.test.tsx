import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { placeOrder } from "../../src/api/ordersApi";
import { QueryClient, QueryClientProvider } from "react-query";
import CheckoutPage from "../../src/pages/Checkout";

// Mock `placeOrder` API call
jest.mock("../../src/api/ordersApi", () => ({
  placeOrder: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    cart: () => ({
      items: [
        { id: "1", name: "Apple", price: 2.5, quantity: 2 },
        { id: "2", name: "Banana", price: 1.5, quantity: 3 },
      ],
    }),
  },
});

const queryClient = new QueryClient();

describe("CheckoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the checkout page with order summary and form fields", () => {
    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CheckoutPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>,
    );

    expect(screen.getByText(/checkout/i)).toBeInTheDocument();
    expect(screen.getByText(/apple/i)).toBeInTheDocument();
    expect(screen.getByText(/banana/i)).toBeInTheDocument();
    expect(screen.getByText(/total price: 9.50 zł/i)).toBeInTheDocument();

    // Total price: 2*2.5 + 3*1.5 = 9.50
    expect(screen.getByLabelText(/Voivodeship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/House Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();
  });

  it("shows validation errors if fields are empty", () => {
    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CheckoutPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>,
    );

    fireEvent.click(screen.getByText(/place order/i));

    expect(screen.getByText(/Voivodeship is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Street is required/i)).toBeInTheDocument();
    expect(screen.getByText(/city is required/i)).toBeInTheDocument();
    expect(screen.getByText(/postal code is required/i)).toBeInTheDocument();
    expect(screen.getByText(/House number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery date is required/i)).toBeInTheDocument();
  });
});

//   it("places an order successfully when fields are valid", async () => {
//     (placeOrder as jest.Mock).mockResolvedValueOnce({
//       message: "Order placed successfully",
//     });
//
//     render(
//       <Provider store={mockStore}>
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <CheckoutPage />
//           </MemoryRouter>
//         </QueryClientProvider>
//       </Provider>,
//     );
//
//     fireEvent.change(screen.getByLabelText(/Voivodeship/i), {
//       target: { value: "Texas" },
//     });
//     fireEvent.change(screen.getByLabelText(/Street/i), {
//       target: { value: "Main St" },
//     });
//     fireEvent.change(screen.getByLabelText(/city/i), {
//       target: { value: "Cityville" },
//     });
//     fireEvent.change(screen.getByLabelText(/House Number/i), {
//       target: { value: "12345" },
//     });
//     fireEvent.change(screen.getByLabelText(/Postal Code/i), {
//       target: { value: "12-345" },
//     });
//
//     const deliveryDate = new Date(2025, 0, 26); // A valid date not in busyDays
//     fireEvent.click(screen.getByText(/26/i)); // Simulate selecting the date in the calendar
//
//     fireEvent.click(screen.getByText(/place order/i));
//
//     await waitFor(() => {
//       expect(placeOrder).toHaveBeenCalledWith({
//         cartItems: [
//           { id: "1", price: 2.5, quantity: 2 },
//           { id: "2", price: 1.5, quantity: 3 },
//         ],
//         shippingAddress: {
//           fullName: "John Doe",
//           address: "123 Main St",
//           city: "Cityville",
//           postalCode: "12345",
//           country: "Countryland",
//         },
//         deliveryDate,
//       });
//     });
//
//     await waitFor(() => {
//       expect(placeOrder).toHaveBeenCalled();
//     });
//   });
//
//   it("shows an error if order placement fails", async () => {
//     (placeOrder as jest.Mock).mockRejectedValueOnce(new Error("Order failed"));
//
//     render(
//       <Provider store={mockStore}>
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <CheckoutPage />
//           </MemoryRouter>
//         </QueryClientProvider>
//       </Provider>,
//     );
//
//     fireEvent.change(screen.getByLabelText(/Voivodeship/i), {
//       target: { value: "Texas" },
//     });
//
//     fireEvent.change(screen.getByLabelText(/city/i), {
//       target: { value: "Cityville" },
//     });
//     fireEvent.change(screen.getByLabelText(/postal code/i), {
//       target: { value: "12345" },
//     });
//
//     fireEvent.click(screen.getByText(/26/i)); // Simulate selecting the date in the calendar
//
//     fireEvent.click(screen.getByText(/place order/i));
//
//     await waitFor(() => {
//       expect(
//         screen.getByText(/Failed to place order. Please try again.:/i),
//       ).toBeInTheDocument();
//     });
//   });
// });
