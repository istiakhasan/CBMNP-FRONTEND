import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllVendors: build.query({
        query: (arg) => ({
          url: "/vendor",
          method: "GET",
          params: arg
        }),
        providesTags: [tagTypes.vendor],
      }),
    getVendorById: build.query({
        query: (arg) => ({
          url: `/vendor/${arg?.id}`,
          method: "GET",
        }),
        providesTags: [tagTypes.vendor],
      }),
    createVendor: build.mutation({
      query: (data) => ({
        url: "/vendor",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.vendor],
    }),
    updateVendor: build.mutation({
      query: (data) => ({
        url: `/vendor/${data?.id}`,
        method: "PATCH",
        data: data?.data,
      }),
      invalidatesTags: [tagTypes.vendor],
    }),
    deleteVendor: build.mutation({
      query: (data) => ({
        url: `/vendor/${data?.id}`,
        method: "DELETE",
        body: data,
        
      }),
      invalidatesTags: [tagTypes.vendor],
    }),
  }),
});

export const {
useGetAllVendorsQuery,
useCreateVendorMutation,
useDeleteVendorMutation,
useGetVendorByIdQuery,
useUpdateVendorMutation

} = vendorApi;
