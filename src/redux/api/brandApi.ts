import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const brandApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBrand: build.mutation({
      query: (data) => ({
        url: "/brand",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.brand],
    }),
    updateBrand: build.mutation({
      query: (data) => ({
        url: `/brand/${data?.id}`,
        method: "PATCH",
        data: data?.data
      }),
      invalidatesTags: [tagTypes.brand],
    }),
    deleteBrand: build.mutation({
      query: (data) => ({
        url: `/brand/${data?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.brand],
    }),
    getAllBrand: build.query({
      query: (arg) => ({
        url: "/brand",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.brand],
    }),
  }),
});

export const {
    useGetAllBrandQuery,
    useDeleteBrandMutation,
    useCreateBrandMutation,
    useUpdateBrandMutation
} = brandApi;
