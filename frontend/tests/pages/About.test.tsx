import { render, screen } from "@testing-library/react";
import About from "../../src/pages/About";

describe("About", () => {
    it("renders the About page", () => {
        render(<About />);

        // Check for the heading
        expect(screen.getByText(/About us/i)).toBeInTheDocument();

        // Check for the paragraph text
        expect(
            screen.getByText(/Welcome to our marketplace!/i)
        ).toBeInTheDocument();
    });
});
