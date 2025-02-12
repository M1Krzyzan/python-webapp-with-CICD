import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HeaderLink from "../../../src/components/layout/HeaderLink";

describe("HeaderLink", () => {
    it("renders the link with correct text and href", () => {
        render(
            <BrowserRouter>
                <HeaderLink to="/test" text="Test Link" />
            </BrowserRouter>
        );

        const link = screen.getByText("Test Link");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/test");
    });
});
