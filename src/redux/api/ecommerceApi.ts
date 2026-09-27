import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const ecommerceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Dashboard stats
    getEcommerceDashboard: build.query({
      query: () => ({ url: "/ecommerce/dashboard", method: "GET" }),
      providesTags: [tagTypes.ecommerce],
    }),

    // Store settings & Theme customization
    getEcommerceSettings: build.query({
      query: () => ({ url: "/ecommerce/settings", method: "GET" }),
      providesTags: [tagTypes.ecommerce],
    }),
    updateEcommerceSettings: build.mutation({
      query: (data) => ({ url: "/ecommerce/settings", method: "PATCH", data }),
      invalidatesTags: [tagTypes.ecommerce],
    }),

    // Storefront Config (Live Preview / Public API)
    getStorefrontConfig: build.query({
      query: () => ({ url: "/ecommerce/storefront/config", method: "GET" }),
      providesTags: [tagTypes.ecommerce],
    }),

    // Coupon Validator
    validateEcommerceCoupon: build.mutation({
      query: (data) => ({ url: "/ecommerce/coupons/validate", method: "POST", data }),
    }),

    // Generic Resources CRUD (banners, sections, collections, coupons, shipping, reviews, pages)
    getEcommerceResource: build.query({
      query: ({ resource, ...params }) => ({
        url: `/ecommerce/${resource}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.ecommerce],
    }),
    getEcommerceResourceById: build.query({
      query: ({ resource, id }) => ({
        url: `/ecommerce/${resource}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ecommerce],
    }),
    createEcommerceResource: build.mutation({
      query: ({ resource, data }) => ({
        url: `/ecommerce/${resource}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.ecommerce],
    }),
    updateEcommerceResource: build.mutation({
      query: ({ resource, id, data }) => ({
        url: `/ecommerce/${resource}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.ecommerce],
    }),
    deleteEcommerceResource: build.mutation({
      query: ({ resource, id }) => ({
        url: `/ecommerce/${resource}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ecommerce],
    }),
  }),
});

export const {
  useGetEcommerceDashboardQuery,
  useGetEcommerceSettingsQuery,
  useUpdateEcommerceSettingsMutation,
  useGetStorefrontConfigQuery,
  useValidateEcommerceCouponMutation,
  useGetEcommerceResourceQuery,
  useGetEcommerceResourceByIdQuery,
  useCreateEcommerceResourceMutation,
  useUpdateEcommerceResourceMutation,
  useDeleteEcommerceResourceMutation,
} = ecommerceApi;
