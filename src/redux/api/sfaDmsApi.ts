import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const sfaDmsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Generic CRUD
    getSfaDmsResource: build.query({
      query: ({ resource, ...params }) => ({ url: `/sfa-dms/${resource}`, method: "GET", params }),
      providesTags: [tagTypes.sfaDms],
    }),
    getSfaDmsResourceById: build.query({
      query: ({ resource, id }) => ({ url: `/sfa-dms/${resource}/${id}`, method: "GET" }),
      providesTags: [tagTypes.sfaDms],
    }),
    createSfaDmsResource: build.mutation({
      query: ({ resource, data }) => ({ url: `/sfa-dms/${resource}`, method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    updateSfaDmsResource: build.mutation({
      query: ({ resource, id, data }) => ({ url: `/sfa-dms/${resource}/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),

    // Secondary Sales Orders
    createSalesOrderWithItems: build.mutation({
      query: (data) => ({ url: "/sfa-dms/orders/create-with-items", method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    getOrderItems: build.query({
      query: (orderId) => ({ url: `/sfa-dms/orders/${orderId}/items`, method: "GET" }),
      providesTags: [tagTypes.sfaDms],
    }),
    updateSalesOrderStatus: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sfa-dms/orders/${id}/status`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),

    // Primary Sales Orders
    createPrimaryOrderWithItems: build.mutation({
      query: (data) => ({ url: "/sfa-dms/primary-orders/create-with-items", method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    getPrimaryOrderItems: build.query({
      query: (orderId) => ({ url: `/sfa-dms/primary-orders/${orderId}/items`, method: "GET" }),
      providesTags: [tagTypes.sfaDms],
    }),
    updatePrimaryOrderStatus: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sfa-dms/primary-orders/${id}/status`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),

    // Distributor Onboarding
    updateDistributorOnboarding: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sfa-dms/distributors/${id}/onboarding`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),

    // Field Attendance & Visits
    checkInAttendance: build.mutation({
      query: (data) => ({ url: "/sfa-dms/attendance/check-in", method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    checkOutAttendance: build.mutation({
      query: (data) => ({ url: "/sfa-dms/attendance/check-out", method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    checkInFieldVisit: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sfa-dms/field-visits/${id}/check-in`, method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    checkOutFieldVisit: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sfa-dms/field-visits/${id}/check-out`, method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),

    // Collections Verification
    verifyCollection: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sfa-dms/collections/${id}/verify`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),

    // Delivery Trips & Returns
    createDeliveryTrip: build.mutation({
      query: (data) => ({ url: "/sfa-dms/trips/create", method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    updateTripStatus: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sfa-dms/trips/${id}/status`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),
    createReturnWithItems: build.mutation({
      query: (data) => ({ url: "/sfa-dms/returns/create-with-items", method: "POST", data }),
      invalidatesTags: [tagTypes.sfaDms],
    }),

    // Reports
    getTargetsAchievementReport: build.query({
      query: (params) => ({ url: "/sfa-dms/reports/targets-achievement", method: "GET", params }),
      providesTags: [tagTypes.sfaDms],
    }),
    getDistributorStockReport: build.query({
      query: (params) => ({ url: "/sfa-dms/reports/distributor-stock", method: "GET", params }),
      providesTags: [tagTypes.sfaDms],
    }),
  }),
});

export const {
  useGetSfaDmsResourceQuery,
  useGetSfaDmsResourceByIdQuery,
  useCreateSfaDmsResourceMutation,
  useUpdateSfaDmsResourceMutation,
  useCreateSalesOrderWithItemsMutation,
  useGetOrderItemsQuery,
  useUpdateSalesOrderStatusMutation,
  useCreatePrimaryOrderWithItemsMutation,
  useGetPrimaryOrderItemsQuery,
  useUpdatePrimaryOrderStatusMutation,
  useUpdateDistributorOnboardingMutation,
  useCheckInAttendanceMutation,
  useCheckOutAttendanceMutation,
  useCheckInFieldVisitMutation,
  useCheckOutFieldVisitMutation,
  useVerifyCollectionMutation,
  useCreateDeliveryTripMutation,
  useUpdateTripStatusMutation,
  useCreateReturnWithItemsMutation,
  useGetTargetsAchievementReportQuery,
  useGetDistributorStockReportQuery,
} = sfaDmsApi;

