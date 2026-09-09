import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const procurementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProcurement: build.mutation({
      query: (data) => ({
        url: "/procurements",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.procurements],
    }),
    createDirectPurchase: build.mutation({
      query: (data) => ({
        url: "/procurements/direct-purchase",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.procurements, tagTypes.inventory, tagTypes.products],
    }),
    getProcurement: build.query({
      query: (params) => ({
        url: "/procurements",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.procurements],
    }),
    getProcurementReports: build.query({
      query: (params) => ({
        url: "/procurements/reports",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.procurements],
    }),
    bulkUpdatePOStatus: build.mutation({
      query: (data) => ({
        url: "/procurements/bulk-update",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.procurements],
    }),
    receivePurchaseOrder: build.mutation({
      query: (data) => ({
        url: "/procurements/receive-order",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.procurements, tagTypes.inventory, tagTypes.products, tagTypes.warehouse],
    }),
  }),
});

export const {
  useCreateProcurementMutation,
  useCreateDirectPurchaseMutation,
  useGetProcurementQuery,
  useBulkUpdatePOStatusMutation,
  useReceivePurchaseOrderMutation,
  useGetProcurementReportsQuery,
  useLazyGetProcurementReportsQuery,
} = procurementApi;
