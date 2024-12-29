import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; // assuming fetchBaseQuery is exported from baseApi

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMainCategory: build.query({
      query: (arg) => ({
        url: "/category",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.mainCategory],
    }),
    createMainCategory: build.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.mainCategory],
    }),
    updateCategory: build.mutation({
      query: (data) => ({
        url: `/category/${data?.id}`,
        method: "PATCH",
        data: data?.data
      }),
      invalidatesTags: [tagTypes.mainCategory],
    }),
    deleteCategory: build.mutation({
      query: (data) => ({
        url: `/main-category/${data?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.mainCategory],
    }),
    
  }),
});

export const {
    useGetAllMainCategoryQuery,
    useCreateMainCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;
