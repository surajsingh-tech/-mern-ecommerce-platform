import { createSlice } from "@reduxjs/toolkit";
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
  },
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { setProduct, setCart } = productSlice.actions;
export default productSlice.reducer;
