import { createSlice } from "@reduxjs/toolkit";
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
    addresses: [],
    selectedAddress: null,
  },
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },

    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (addr, index) => index !== action.payload,
      );

      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
      }
    },
  },
});

export const {
  setProduct,
  setCart,
  addAddress,
  setSelectedAddress,
  deleteAddress,
  setBuyNow,
  setAddresses,
} = productSlice.actions;
export default productSlice.reducer;
