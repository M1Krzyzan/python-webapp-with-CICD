import {fireEvent, render, screen} from "@testing-library/react";
import RegisterForm from "../../src/pages/Register";
import registerClients from "../../src/hooks/registerClients";
import {MemoryRouter, useNavigate} from "react-router-dom";


// Mock the registerClients hook
jest.mock("../../src/hooks/registerClients", () => ({
  __esModule: true,
  default: () => ({
    addClient: jest.fn().mockResolvedValue({}), // Mock successful response
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(() => jest.fn()), // Mock navigate function
}));

describe("RegisterForm", () => {
  it("submits the form successfully when all fields are valid", async () => {
    const mockAddClient = registerClients().addClient;

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    // Fill out the general form fields
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/NIP/i), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: "Test Company" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // Fill out the Payment Address fields
    const paymentFields = screen.getAllByLabelText(/^Voivodeship$/i);
    fireEvent.change(paymentFields[0], {
      target: { value: "Payment Voivodeship" },
    });
    fireEvent.change(screen.getAllByLabelText(/^City$/i)[0], {
      target: { value: "Payment City" },
    });
    fireEvent.change(screen.getAllByLabelText(/^Street$/i)[0], {
      target: { value: "Payment Street" },
    });
    fireEvent.change(screen.getAllByLabelText(/Building Number/i)[0], {
      target: { value: "123" },
    });
    fireEvent.change(screen.getAllByLabelText(/Postal Code/i)[0], {
      target: { value: "12345" },
    });

    // Fill out the Delivery Address fields
    fireEvent.change(paymentFields[1], {
      target: { value: "Delivery Voivodeship" },
    });
    fireEvent.change(screen.getAllByLabelText(/^City$/i)[1], {
      target: { value: "Delivery City" },
    });
    fireEvent.change(screen.getAllByLabelText(/^Street$/i)[1], {
      target: { value: "Delivery Street" },
    });
    fireEvent.change(screen.getAllByLabelText(/Building Number/i)[1], {
      target: { value: "456" },
    });
    fireEvent.change(screen.getAllByLabelText(/Postal Code/i)[1], {
      target: { value: "67890" },
    });

    // Simulate clicking the register button
    const registerButton = screen.getByText(/Register/i);
    fireEvent.click(registerButton);

    // Wait for the mockAddClient to be called
    // await waitFor(() => {
    //   expect(mockAddClient).toBeCalledWith(
    //     expect.objectContaining({
    //       email: "test@example.com",
    //       nip: "123456789",
    //       company_name: "Test Company",
    //       payment_address: {
    //         voivodeship: "Payment Voivodeship",
    //         city: "Payment City",
    //         street: "Payment Street",
    //         postal_code: "12345",
    //         house_number: "123",
    //       },
    //       delivery_address: {
    //         voivodeship: "Delivery Voivodeship",
    //         city: "Delivery City",
    //         street: "Delivery Street",
    //         postal_code: "67890",
    //         house_number: "456",
    //       },
    //       password: "password123",
    //     })
    //   );
    // });

    // Ensure error message is not present
    expect(
      screen.queryByText(/Please fill all of the fields/i)
    ).not.toBeInTheDocument();
  });


  it("shows an error message when required fields are empty", async () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    // Simulate clicking the register button without filling the form
    const registerButton = screen.getByText(/Register/i);
    fireEvent.click(registerButton);

    // Expect error message to be displayed
    expect(
      screen.getByText(/Please fill all of the fields/i)
    ).toBeInTheDocument();
  });


  it("renders the form with all input fields and submit button", () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    // Verify input fields
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NIP/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();


    // Delivery Address fields are similar; ensure they're tested
    expect(screen.getAllByLabelText(/^Voivodeship$/i).length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText(/^City$/i).length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText(/^Street$/i).length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText(/Building Number/i).length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText(/Postal Code/i).length).toBeGreaterThan(1);

    // Verify password field and submit button
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});
