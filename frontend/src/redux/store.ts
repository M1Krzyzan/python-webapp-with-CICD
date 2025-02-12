import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage as default
import productsReducer from "../model/product";
import cartReducer from "../model/cardItem";
import checkoutFormDataReducer from "../model/checkoutFormData";
import orderReducer from "../model/order";

const cartPersistConfig = {
  key: "cart",
  storage,
};

const checkoutPersistConfig = {
  key: "checkoutForm",
  storage,
};

const orderPersistConfig = {
  key: "order",
  storage,
};


const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedCheckoutFormDataReducer = persistReducer(
  checkoutPersistConfig,
  checkoutFormDataReducer,
);
const persistedOrderReducer = persistReducer(orderPersistConfig, orderReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    products: productsReducer,
    checkoutFormData: persistedCheckoutFormDataReducer,
    order: persistedOrderReducer,
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;