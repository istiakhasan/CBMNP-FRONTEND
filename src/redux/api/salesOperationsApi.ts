import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const salesOperationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Quotations
    getQuotations: build.query({
      query: () => ({ url: "/sales-operations/quotations", method: "GET" }),
      providesTags: [tagTypes.salesOperations],
    }),
    createQuotation: build.mutation({
      query: (data) => ({ url: "/sales-operations/quotations", method: "POST", data }),
      invalidatesTags: [tagTypes.salesOperations],
    }),
    convertToOrder: build.mutation({
      query: (id) => ({ url: `/sales-operations/quotations/${id}/convert-to-order`, method: "PATCH" }),
      invalidatesTags: [tagTypes.salesOperations, tagTypes.order],
    }),

    // Coupons
    createCoupon: build.mutation({
      query: (data) => ({ url: "/sales-operations/coupons", method: "POST", data }),
      invalidatesTags: [tagTypes.salesOperations],
    }),
    validateCoupon: build.mutation({
      query: (data) => ({ url: "/sales-operations/coupons/validate", method: "POST", data }),
    }),

    // Customer Credit
    setCreditLimit: build.mutation({
      query: (data) => ({ url: "/sales-operations/customer-credit", method: "POST", data }),
      invalidatesTags: [tagTypes.salesOperations],
    }),
    checkCustomerCredit: build.query({
      query: (customerId) => ({ url: `/sales-operations/customer-credit/${customerId}`, method: "GET" }),
      providesTags: [tagTypes.salesOperations],
    }),

    // POS Sessions
    getPosSessions: build.query({
      query: () => ({ url: "/sales-operations/pos-sessions", method: "GET" }),
      providesTags: [tagTypes.salesOperations],
    }),
    openPosSession: build.mutation({
      query: (data) => ({ url: "/sales-operations/pos-sessions/open", method: "POST", data }),
      invalidatesTags: [tagTypes.salesOperations],
    }),
    recordCashMovement: build.mutation({
      query: (data) => ({ url: "/sales-operations/pos-sessions/cash-movement", method: "POST", data }),
      invalidatesTags: [tagTypes.salesOperations],
    }),
    closePosSession: build.mutation({
      query: ({ id, ...data }) => ({ url: `/sales-operations/pos-sessions/${id}/close`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.salesOperations],
    }),
  }),
});

export const {
  useGetQuotationsQuery,
  useCreateQuotationMutation,
  useConvertToOrderMutation,
  useCreateCouponMutation,
  useValidateCouponMutation,
  useSetCreditLimitMutation,
  useCheckCustomerCreditQuery,
  useGetPosSessionsQuery,
  useOpenPosSessionMutation,
  useRecordCashMovementMutation,
  useClosePosSessionMutation,
} = salesOperationsApi;
