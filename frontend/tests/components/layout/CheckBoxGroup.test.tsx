import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckBoxGroup from "../../../src/components/layout/CheckBoxGroup";
import "@testing-library/jest-dom"; // Extend Jest with custom matchers for DOM assertions


describe('CheckBoxGroup', () => {
    it('renders title and options', () => {
        render(
            <CheckBoxGroup
                title="Test Group"
                options={['Option 1', 'Option 2']}
                filterValues={['value1', 'value2']}
                selectedValues={['value1']}
                onChange={jest.fn()}
            />
        );

        expect(screen.getByText('Test Group')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('calls onChange when an option is clicked', () => {
        const mockOnChange = jest.fn();
        render(
            <CheckBoxGroup
                title="Test Group"
                options={['Option 1']}
                filterValues={['value1']}
                selectedValues={[]}
                onChange={mockOnChange}
            />
        );

        fireEvent.click(screen.getByRole('checkbox'));
        expect(mockOnChange).toHaveBeenCalledWith('value1');
    });
});
