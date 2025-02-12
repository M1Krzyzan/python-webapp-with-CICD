import React from "react";
import { render, screen } from "@testing-library/react";
import CartItemsHeader from "../../../src/components/cart/CartItemsHeader";

describe("CartItemsHeader", () => {
    it("renders header labels correctly", () => {
        render(<CartItemsHeader />);

        expect(screen.getByText("PRODUCT DETAILS")).toBeInTheDocument();
        expect(screen.getByText("AMOUNT [1kg]")).toBeInTheDocument();
        expect(screen.getByText("PRICE")).toBeInTheDocument();
        expect(screen.getByText("TOTAL")).toBeInTheDocument();
    });
});
