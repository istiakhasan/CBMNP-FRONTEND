import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const logisticsOperationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoutingRules: build.query({
      query: () => ({ url: "/logistics-operations/routing-rules", method: "GET" }),
      providesTags: [tagTypes.logisticsOperations],
    }),
    createRoutingRule: build.mutation({
      query: (data) => ({ url: "/logistics-operations/routing-rules", method: "POST", data }),
      invalidatesTags: [tagTypes.logisticsOperations],
    }),
    getRateMatrices: build.query({
      query: () => ({ url: "/logistics-operations/rate-matrix", method: "GET" }),
      providesTags: [tagTypes.logisticsOperations],
    }),
    setRateMatrix: build.mutation({
      query: (data) => ({ url: "/logistics-operations/rate-matrix", method: "POST", data }),
      invalidatesTags: [tagTypes.logisticsOperations],
    }),
    getPickLists: build.query({
      query: () => ({ url: "/logistics-operations/pick-lists", method: "GET" }),
      providesTags: [tagTypes.logisticsOperations],
    }),
    generatePickList: build.mutation({
      query: (data) => ({ url: "/logistics-operations/pick-lists", method: "POST", data }),
      invalidatesTags: [tagTypes.logisticsOperations],
    }),
    getSettlements: build.query({
      query: () => ({ url: "/logistics-operations/settlements", method: "GET" }),
      providesTags: [tagTypes.logisticsOperations],
    }),
    reconcileSettlement: build.mutation({
      query: (data) => ({ url: "/logistics-operations/settlements", method: "POST", data }),
      invalidatesTags: [tagTypes.logisticsOperations, tagTypes.finance],
    }),
  }),
});

export const {
  useGetRoutingRulesQuery,
  useCreateRoutingRuleMutation,
  useGetRateMatricesQuery,
  useSetRateMatrixMutation,
  useGetPickListsQuery,
  useGeneratePickListMutation,
  useGetSettlementsQuery,
  useReconcileSettlementMutation,
} = logisticsOperationsApi;
