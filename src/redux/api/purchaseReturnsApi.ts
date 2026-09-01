import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const purchaseReturnsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPurchaseReturns: build.query({
      query: () => ({ url: "/purchase-returns/returns", method: "GET" }),
      providesTags: [tagTypes.purchaseReturns],
    }),
    createPurchaseReturn: build.mutation({
      query: (data) => ({ url: "/purchase-returns/returns", method: "POST", data }),
      invalidatesTags: [tagTypes.purchaseReturns],
    }),
    approvePurchaseReturn: build.mutation({
      query: (id) => ({ url: `/purchase-returns/returns/${id}/approve`, method: "PATCH" }),
      invalidatesTags: [tagTypes.purchaseReturns, tagTypes.inventory, tagTypes.finance],
    }),
    getGRNs: build.query({
      query: () => ({ url: "/purchase-returns/grn", method: "GET" }),
      providesTags: [tagTypes.purchaseReturns],
    }),
    createGRN: build.mutation({
      query: (data) => ({ url: "/purchase-returns/grn", method: "POST", data }),
      invalidatesTags: [tagTypes.purchaseReturns, tagTypes.inventory],
    }),
    getRFQs: build.query({
      query: () => ({ url: "/purchase-returns/rfq", method: "GET" }),
      providesTags: [tagTypes.purchaseReturns],
    }),
    createRFQ: build.mutation({
      query: (data) => ({ url: "/purchase-returns/rfq", method: "POST", data }),
      invalidatesTags: [tagTypes.purchaseReturns],
    }),
    compareRFQ: build.query({
      query: (id) => ({ url: `/purchase-returns/rfq/${id}/compare`, method: "GET" }),
      providesTags: [tagTypes.purchaseReturns],
    }),
  }),
});

export const {
  useGetPurchaseReturnsQuery,
  useCreatePurchaseReturnMutation,
  useApprovePurchaseReturnMutation,
  useGetGRNsQuery,
  useCreateGRNMutation,
  useGetRFQsQuery,
  useCreateRFQMutation,
  useCompareRFQQuery,
} = purchaseReturnsApi;
