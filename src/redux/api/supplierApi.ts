import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSupplierOptions: build.query({
      query: (arg) => ({
        url: "/supplier/options",
        method: "GET",
        params:arg
      }),
      providesTags: [tagTypes.supplier],
    }),
    getAllSupplier: build.query({
      query: (arg) => ({
        url: "/supplier/get-all",
        method: "GET",
        params:arg
      }),
      providesTags: [tagTypes.supplier],
    }),
    createSupplier: build.mutation({
      query: (data) => ({
        url: "/supplier",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.supplier]
    }),
    updateSupplier: build.mutation({
      query: (data) => ({
        url: `/supplier/${data?.id}`,
        method: "PATCH",
        data:data?.data
      }),
      invalidatesTags: [tagTypes.supplier]
    }),
  }),
});

export const {
 useGetAllSupplierOptionsQuery,
useCreateSupplierMutation,
useUpdateSupplierMutation,
useGetAllSupplierQuery
} = supplierApi;
