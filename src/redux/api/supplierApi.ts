import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSupplier: build.query({
      query: (arg) => ({
        url: "/supplier/options",
        method: "GET",
        params:arg
      }),
      providesTags: [tagTypes.supplier],
    }),
  }),
});

export const {
 useGetAllSupplierQuery

} = supplierApi;
