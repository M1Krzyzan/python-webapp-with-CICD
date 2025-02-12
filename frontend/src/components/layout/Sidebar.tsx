import React from "react";
import List from "@mui/material/List";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";
import CheckBoxGroup from "./CheckBoxGroup";
import {
  setCountryOfOriginFilter,
  setFruitOrVegetableFilter,
} from "../../model/product";
import { useProducts } from "../../hooks/useProducts.ts";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { data: products = [], isLoading, error } = useProducts();
  const { filters } = useSelector((state: RootState) => state.products);

  // Only render the sidebar on the root path
  if (location.pathname !== "/") {
    return null;
  }

  const countryOptions = Array.from(
    new Set(products.map((product: any) => product.country_of_origin)),
  );

  // Define filter categories with explicit typing for filterKey
  const categories: {
    title: string;
    options: string[];
    filterValues: string[];
    filterKey: keyof typeof filters; // Ensure filterKey matches filters keys
    filterAction: (value: string) => any;
  }[] = [
    {
      title: "Category",
      options: ["Vegetable", "Fruit"],
      filterValues: ["Vegetable", "Fruit"],
      filterKey: "fruitOrVegetable",
      filterAction: setFruitOrVegetableFilter,
    },
    {
      title: "Country of origin",
      options: countryOptions,
      filterValues: countryOptions,
      filterKey: "countryOfOrigin",
      filterAction: setCountryOfOriginFilter,
    },
  ];

  return (
    <nav className="sidebar">
      <List sx={{ position: "sticky", top: "0", marginBottom: "200px" }}>
        <Box sx={{ mt: 1, color: "#4caf50" }}>
          {categories.map((category, index) => (
            <CheckBoxGroup
              key={index}
              title={category.title}
              options={category.options}
              filterValues={category.filterValues}
              selectedValues={filters[category.filterKey] || []} // Pass selected filter values
              onChange={(filterValue: string) => {
                dispatch(category.filterAction(filterValue));
              }}
            />
          ))}
        </Box>
      </List>
    </nav>
  );
};

export default Sidebar;