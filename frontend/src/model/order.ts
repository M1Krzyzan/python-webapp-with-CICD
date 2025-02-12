import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
    orderId: string | null;
}

const initialState: OrderState = {
    orderId: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrderId(state, action: PayloadAction<string>) {
            state.orderId = action.payload;
        },
        clearOrderId(state) {
            state.orderId = null;
        },
    },
});

export const { setOrderId, clearOrderId } = orderSlice.actions;
export default orderSlice.reducer;
