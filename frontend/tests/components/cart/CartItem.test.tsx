import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartItem from "../../../src/components/cart/CartItem";

const mockHandleQuantityChange = jest.fn();

const mockItem = {
    id: "1",
    name: "Apple",
    price: 2.5,
    quantity: 3,
    photo: "apple.jpg",
};

describe("CartItem", () => {
    it("renders item details correctly", () => {
        render(
            <CartItem item={mockItem} handleQuantityChange={mockHandleQuantityChange} />
        );

        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.getByText("2.50 zł")).toBeInTheDocument(); // Price per item
        expect(screen.getByText("7.50 zł")).toBeInTheDocument(); // Total price
        expect(screen.getByAltText("Apple")).toBeInTheDocument(); // Product image
    });

    it("calls handleQuantityChange when quantity changes", () => {
        render(
            <CartItem item={mockItem} handleQuantityChange={mockHandleQuantityChange} />
        );

        const incrementButton = screen.getByText("+");
        const decrementButton = screen.getByText("-");

        fireEvent.click(incrementButton);
        expect(mockHandleQuantityChange).toHaveBeenCalledWith("1", 4);

        fireEvent.click(decrementButton);
        expect(mockHandleQuantityChange).toHaveBeenCalledWith("1", 2);
    });
});
