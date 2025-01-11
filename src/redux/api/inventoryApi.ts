import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loadAllInventory: build.query({
      query: (arg) => ({
        url: "/inventory",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.inventory],
    }),
  }),
});

export const {
    useLoadAllInventoryQuery,

} = inventoryApi;
