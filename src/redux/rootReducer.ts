import { baseApi } from "./api/baseApi";
import  menuSlice from "./feature/menuSlice";

export const reducer = {
  menu:menuSlice,
  [baseApi.reducerPath]: baseApi.reducer,
};