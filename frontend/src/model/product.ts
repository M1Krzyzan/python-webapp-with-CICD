import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductsState {
  filters: {
    fruitOrVegetable: string[];
    countryOfOrigin: string[];
  };
}

const initialState: ProductsState = {
  filters: {
    fruitOrVegetable: [],
    countryOfOrigin: [],
  },
};

const toggleFilter = (currentFilters: string[], value: string): string[] => {
  return currentFilters.includes(value)
    ? currentFilters.filter((item) => item !== value)
    : [...currentFilters, value];
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFruitOrVegetableFilter(state, action: PayloadAction<string>) {
      state.filters.fruitOrVegetable = toggleFilter(
        state.filters.fruitOrVegetable,
        action.payload,
      );
    },
    setCountryOfOriginFilter(state, action: PayloadAction<string>) {
      state.filters.countryOfOrigin = toggleFilter(
        state.filters.countryOfOrigin,
        action.payload,
      );
    },
  },
});

export const { setFruitOrVegetableFilter, setCountryOfOriginFilter } =
  productsSlice.actions;

export default productsSlice.reducer;