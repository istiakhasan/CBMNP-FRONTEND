import { getFormLocalStorage } from "@/util/local-storage";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { authKey } from "@/constants/storageKey";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSimpleProduct: build.mutation({
      query: (data) => ({
        url: `/products`,
        method: "POST",
         data,
      }),
      invalidatesTags: [tagTypes.products],
    }),
    createVariantProduct: build.mutation({
      query: (data) => ({
        url: `/products/variant`,
        method: "POST",
         data,
      }),
      invalidatesTags: [tagTypes.products],
    }),
    getProductCount: build.query({
      query: () => ({
        url: "/products/count",
        method: "GET"
      }),
      providesTags: [tagTypes.products],
    }),
    updateProduct: build.mutation({
      query: (data) => ({
        url: `/products/${data?.id}`,
        method: "PATCH",
        data: data?.data
      }),
      invalidatesTags: [tagTypes.products],
    }),
    getAllProduct: build.query({
      query: (arg) => ({
        url: "/products",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.products],
    }),
    getProductById: build.query({
      query: (arg) => ({
        url: `/products/${arg?.id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),
    getAllProductBySearch: build.query({
      query: (arg) => ({
        url: "/products/search",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.products],
    }),
    deleteProductById: build.mutation({
      query: (data) => ({
        url: `/products/${data?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.products],
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useCreateSimpleProductMutation,
  useCreateVariantProductMutation,
  useDeleteProductByIdMutation,
  useGetAllProductBySearchQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useGetProductCountQuery
} = productApi;
