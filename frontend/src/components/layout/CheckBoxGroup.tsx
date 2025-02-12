import React from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

interface CheckboxGroupProps {
  title: string;
  options: string[];
  filterValues: string[];
  selectedValues: string[];
  onChange: (filterValue: string) => void;
}

const CheckBoxGroup: React.FC<CheckboxGroupProps> = ({
  title,
  options,
  filterValues,
  selectedValues = [],
  onChange,
}) => {
  return (
    <Box sx={{ mb: 2, marginLeft: "1rem" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selectedValues.includes(filterValues[index])}
                onChange={() => onChange(filterValues[index])}
              />
            }
            label={option}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: "black",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CheckBoxGroup;