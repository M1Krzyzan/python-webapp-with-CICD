import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuantityInput from "../../../src/components/cart/QuantityInput";

describe("QuantityInput", () => {
  const mockHandleQuantityChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with the correct initial quantity", () => {
    render(
      <QuantityInput
        quantity={3}
        productID="test-product"
        handleQuantityChange={mockHandleQuantityChange}
      />,
    );
    const input = screen.getByDisplayValue("3");
    expect(input).toBeInTheDocument();
  });

  it("calls handleQuantityChange when increment button is clicked", () => {
    render(
      <QuantityInput
        quantity={3}
        productID="test-product"
        handleQuantityChange={mockHandleQuantityChange}
      />,
    );

    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);

    expect(mockHandleQuantityChange).toHaveBeenCalledWith("test-product", 4);
  });

  it("calls handleQuantityChange when decrement button is clicked", () => {
    render(
      <QuantityInput
        quantity={3}
        productID="test-product"
        handleQuantityChange={mockHandleQuantityChange}
      />,
    );

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    expect(mockHandleQuantityChange).toHaveBeenCalledWith("test-product", 2);
  });

  it("does not decrement below 1", () => {
    render(
      <QuantityInput
        quantity={0}
        productID="test-product"
        handleQuantityChange={mockHandleQuantityChange}
      />,
    );

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    expect(mockHandleQuantityChange).not.toHaveBeenCalledWith(1);
  });

  it("updates quantity when a valid number is typed", () => {
    render(
      <QuantityInput
        quantity={3}
        productID="test-product"
        handleQuantityChange={mockHandleQuantityChange}
      />,
    );

    const input = screen.getByDisplayValue("3");
    fireEvent.change(input, { target: { value: "5" } });

    expect(mockHandleQuantityChange).toHaveBeenCalledWith("test-product", 5);
  });

  it("resets quantity to 1 when invalid value is typed", () => {
    render(
      <QuantityInput
        quantity={3}
        productID="test-product"
        handleQuantityChange={mockHandleQuantityChange}
      />,
    );

    const input = screen.getByDisplayValue("3");
    fireEvent.change(input, { target: { value: "" } });

    expect(mockHandleQuantityChange).toHaveBeenCalledWith("test-product", 1);
  });
});
