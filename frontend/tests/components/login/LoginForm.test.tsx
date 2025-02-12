import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import LoginForm from "../../../src/components/login/LoginForm";
import { MemoryRouter } from "react-router-dom";



jest.mock("axios");

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error in tests
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore console methods
  });

  it("submits form and navigates based on role", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        access_token: `header.${btoa(
          JSON.stringify({ role: "admin" })
        )}.signature`,
        fullname: "Admin User",
      },
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8002/auth/login",
        expect.any(FormData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      expect(localStorage.getItem("access_token")).toBe(
        "header.eyJyb2xlIjoiYWRtaW4ifQ==.signature"
      );
      expect(localStorage.getItem("user_role")).toBe("admin");
    });
  });

  it("shows an error message on invalid credentials", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid email or password")
    );

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(
      "http://127.0.0.1:8002/auth/login",
      expect.any(FormData),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  });
});
