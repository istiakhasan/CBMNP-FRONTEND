import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const garmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Dashboard
    getGarmentsDashboard: build.query({
      query: () => ({
        url: "/garments/dashboard",
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),

    // Buyer Orders
    getGarmentsOrders: build.query({
      query: (params) => ({
        url: "/garments/orders",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    getAllGarmentsOrdersList: build.query({
      query: () => ({
        url: "/garments/orders/all",
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),
    getGarmentsOrderById: build.query({
      query: (id) => ({
        url: `/garments/orders/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),
    createGarmentsOrder: build.mutation({
      query: (data) => ({
        url: "/garments/orders",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    updateGarmentsOrder: build.mutation({
      query: ({ id, data }) => ({
        url: `/garments/orders/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    deleteGarmentsOrder: build.mutation({
      query: (id) => ({
        url: `/garments/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.garments],
    }),

    // Bill of Materials (BOM)
    getGarmentsBoms: build.query({
      query: (params) => ({
        url: "/garments/boms",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    getAllGarmentsBomsList: build.query({
      query: () => ({
        url: "/garments/boms/all",
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),
    getGarmentsBomById: build.query({
      query: (id) => ({
        url: `/garments/boms/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),
    createGarmentsBom: build.mutation({
      query: (data) => ({
        url: "/garments/boms",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    updateGarmentsBom: build.mutation({
      query: ({ id, data }) => ({
        url: `/garments/boms/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    approveGarmentsBom: build.mutation({
      query: (id) => ({
        url: `/garments/boms/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    deleteGarmentsBom: build.mutation({
      query: (id) => ({
        url: `/garments/boms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.garments],
    }),

    // Purchase Orders (PO)
    getGarmentsPos: build.query({
      query: (params) => ({
        url: "/garments/pos",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    getAllGarmentsPosList: build.query({
      query: () => ({
        url: "/garments/pos/all",
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),
    getGarmentsPoById: build.query({
      query: (id) => ({
        url: `/garments/pos/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),
    createGarmentsPo: build.mutation({
      query: (data) => ({
        url: "/garments/pos",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    updateGarmentsPo: build.mutation({
      query: ({ id, data }) => ({
        url: `/garments/pos/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    submitGarmentsPoCheck: build.mutation({
      query: (id) => ({
        url: `/garments/pos/${id}/submit-check`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    decideGarmentsPoCheck: build.mutation({
      query: ({ id, decision, note }) => ({
        url: `/garments/pos/${id}/decide-check`,
        method: "PATCH",
        data: { decision, note },
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    decideGarmentsPoApproval: build.mutation({
      query: ({ id, decision, note }) => ({
        url: `/garments/pos/${id}/decide-approval`,
        method: "PATCH",
        data: { decision, note },
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    deleteGarmentsPo: build.mutation({
      query: (id) => ({
        url: `/garments/pos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    receiveGarmentsPo: build.mutation({
      query: (data) => ({
        url: "/garments/pos/receive",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    getGarmentsPoReceivingProgress: build.query({
      query: (id) => ({
        url: `/garments/pos/${id}/receiving-progress`,
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),

    // Inventory & Adjustments
    getGarmentsInventory: build.query({
      query: (params) => ({
        url: "/garments/inventory",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    getGarmentsInventoryCatalog: build.query({
      query: (params) => ({
        url: "/garments/inventory/catalog",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    getGarmentsLotsForItem: build.query({
      query: ({ category, name }) => ({
        url: "/garments/inventory/lots-for-item",
        method: "GET",
        params: { category, name },
      }),
      providesTags: [tagTypes.garments],
    }),
    proposeGarmentsAdjustment: build.mutation({
      query: (data) => ({
        url: "/garments/inventory/adjustments",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    directStockInGarmentsInventory: build.mutation({
      query: (data) => ({
        url: "/garments/inventory/direct-stock-in",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    getGarmentsSampleInwards: build.query({
      query: (params) => ({
        url: "/garments/inventory/sample-inwards",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    decideGarmentsSampleInwardApproval: build.mutation({
      query: ({ id, decision, note }) => ({
        url: `/garments/inventory/sample-inwards/${id}/decide`,
        method: "PATCH",
        data: { decision, note },
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    getGarmentsAdjustments: build.query({
      query: (params) => ({
        url: "/garments/inventory/adjustments",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    getGarmentsPendingAdjustments: build.query({
      query: () => ({
        url: "/garments/inventory/adjustments/pending",
        method: "GET",
      }),
      providesTags: [tagTypes.garments],
    }),
    decideGarmentsAdjustment: build.mutation({
      query: ({ id, decision, note }) => ({
        url: `/garments/inventory/adjustments/${id}/decide`,
        method: "PATCH",
        data: { decision, note },
      }),
      invalidatesTags: [tagTypes.garments],
    }),

    // Floor Material Issue & Return
    createGarmentsMaterialIssue: build.mutation({
      query: (data) => ({
        url: "/garments/material-issues",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    createGarmentsMaterialReturn: build.mutation({
      query: (data) => ({
        url: "/garments/material-issues/return",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.garments],
    }),
    getGarmentsMaterialIssues: build.query({
      query: (params) => ({
        url: "/garments/material-issues",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.garments],
    }),
    getGarmentsMaterialSummaryByBom: build.query({
      query: (bomId) => ({
        url: "/garments/material-issues/summary",
        method: "GET",
        params: { bomId },
      }),
      providesTags: [tagTypes.garments],
    }),
  }),
});

export const {
  useGetGarmentsDashboardQuery,
  useGetGarmentsOrdersQuery,
  useGetAllGarmentsOrdersListQuery,
  useGetGarmentsOrderByIdQuery,
  useCreateGarmentsOrderMutation,
  useUpdateGarmentsOrderMutation,
  useDeleteGarmentsOrderMutation,
  useGetGarmentsBomsQuery,
  useGetAllGarmentsBomsListQuery,
  useGetGarmentsBomByIdQuery,
  useCreateGarmentsBomMutation,
  useUpdateGarmentsBomMutation,
  useApproveGarmentsBomMutation,
  useDeleteGarmentsBomMutation,
  useGetGarmentsPosQuery,
  useGetAllGarmentsPosListQuery,
  useGetGarmentsPoByIdQuery,
  useCreateGarmentsPoMutation,
  useUpdateGarmentsPoMutation,
  useSubmitGarmentsPoCheckMutation,
  useDecideGarmentsPoCheckMutation,
  useDecideGarmentsPoApprovalMutation,
  useDeleteGarmentsPoMutation,
  useReceiveGarmentsPoMutation,
  useGetGarmentsPoReceivingProgressQuery,
  useGetGarmentsInventoryQuery,
  useGetGarmentsInventoryCatalogQuery,
  useGetGarmentsLotsForItemQuery,
  useProposeGarmentsAdjustmentMutation,
  useDirectStockInGarmentsInventoryMutation,
  useGetGarmentsSampleInwardsQuery,
  useDecideGarmentsSampleInwardApprovalMutation,
  useGetGarmentsAdjustmentsQuery,
  useGetGarmentsPendingAdjustmentsQuery,
  useDecideGarmentsAdjustmentMutation,
  useCreateGarmentsMaterialIssueMutation,
  useCreateGarmentsMaterialReturnMutation,
  useGetGarmentsMaterialIssuesQuery,
  useGetGarmentsMaterialSummaryByBomQuery,
} = garmentsApi;
