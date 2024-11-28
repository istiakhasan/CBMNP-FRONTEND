import { baseApi } from "./api/baseApi";
// import  cartSlice from "./slice/cart";

export const reducer = {
//   cart:cartSlice,
  [baseApi.reducerPath]: baseApi.reducer,
};