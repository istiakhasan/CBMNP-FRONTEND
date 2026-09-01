import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const inventoryOperationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Locations
    getLocations: build.query({
      query: (warehouseId) => ({ url: `/inventory-operations/locations/${warehouseId}`, method: "GET" }),
      providesTags: [tagTypes.inventoryOperations],
    }),
    createLocation: build.mutation({
      query: (data) => ({ url: "/inventory-operations/locations", method: "POST", data }),
      invalidatesTags: [tagTypes.inventoryOperations],
    }),

    // Transfers
    getTransfers: build.query({
      query: () => ({ url: "/inventory-operations/transfers", method: "GET" }),
      providesTags: [tagTypes.inventoryOperations],
    }),
    createTransfer: build.mutation({
      query: (data) => ({ url: "/inventory-operations/transfers", method: "POST", data }),
      invalidatesTags: [tagTypes.inventoryOperations],
    }),
    dispatchTransfer: build.mutation({
      query: (id) => ({ url: `/inventory-operations/transfers/${id}/dispatch`, method: "PATCH" }),
      invalidatesTags: [tagTypes.inventoryOperations, tagTypes.inventory],
    }),
    receiveTransfer: build.mutation({
      query: ({ id, ...data }) => ({ url: `/inventory-operations/transfers/${id}/receive`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.inventoryOperations, tagTypes.inventory],
    }),

    // Adjustments
    getAdjustments: build.query({
      query: () => ({ url: "/inventory-operations/adjustments", method: "GET" }),
      providesTags: [tagTypes.inventoryOperations],
    }),
    createAdjustment: build.mutation({
      query: (data) => ({ url: "/inventory-operations/adjustments", method: "POST", data }),
      invalidatesTags: [tagTypes.inventoryOperations],
    }),
    approveAdjustment: build.mutation({
      query: (id) => ({ url: `/inventory-operations/adjustments/${id}/approve`, method: "PATCH" }),
      invalidatesTags: [tagTypes.inventoryOperations, tagTypes.inventory],
    }),

    // Batches & Alerts
    createBatch: build.mutation({
      query: (data) => ({ url: "/inventory-operations/batches", method: "POST", data }),
      invalidatesTags: [tagTypes.inventoryOperations],
    }),
    getExpiringBatches: build.query({
      query: (params) => ({ url: "/inventory-operations/reports/expiring-batches", method: "GET", params }),
      providesTags: [tagTypes.inventoryOperations],
    }),
    getLowStockAlerts: build.query({
      query: () => ({ url: "/inventory-operations/reports/low-stock", method: "GET" }),
      providesTags: [tagTypes.inventoryOperations],
    }),
    getInventoryValuation: build.query({
      query: () => ({ url: "/inventory-operations/reports/valuation", method: "GET" }),
      providesTags: [tagTypes.inventoryOperations],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useGetTransfersQuery,
  useCreateTransferMutation,
  useDispatchTransferMutation,
  useReceiveTransferMutation,
  useGetAdjustmentsQuery,
  useCreateAdjustmentMutation,
  useApproveAdjustmentMutation,
  useCreateBatchMutation,
  useGetExpiringBatchesQuery,
  useGetLowStockAlertsQuery,
  useGetInventoryValuationQuery,
} = inventoryOperationsApi;
