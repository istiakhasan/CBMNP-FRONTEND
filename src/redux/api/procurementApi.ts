import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const procurementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProcurement: build.mutation({
      query: (data) => ({
        url: "/procurements",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.procurements],
    }),
    getProcurement: build.query({
      query: (params) => ({
        url: "/procurements",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.procurements],
    }),
    getProcurementReports: build.query({
      query: (params) => ({
        url: "/procurements/reports",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.procurements],
    }),
    bulkUpdatePOStatus: build.mutation({
      query: (data) => ({
        url: "/procurements/bulk-update",
        method: "PATCH",
        data
      }),
      invalidatesTags: [tagTypes.procurements],
    }),
    receivePurchaseOrder: build.mutation({
      query: (data) => ({
        url: "/procurements/receive-order",
        method: "PATCH",
        data
      }),
      invalidatesTags: [tagTypes.procurements],
    }),
  }),
});

export const {
 useCreateProcurementMutation,
 useGetProcurementQuery,
 useBulkUpdatePOStatusMutation,
 useReceivePurchaseOrderMutation,
 useGetProcurementReportsQuery,
 useLazyGetProcurementReportsQuery
} = procurementApi;
