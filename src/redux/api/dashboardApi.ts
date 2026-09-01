import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMonthlySalesReport: build.query({
      query: (arg) => ({
        url: "/dashboard/monthly-report",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.dashboard],
    }),
    getDashboardSummary: build.query({
      query: (arg) => ({
        url: "/dashboard/total-summary",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.dashboard],
    }),
    statusDistribution: build.query({
      query: (arg) => ({
        url: "/dashboard/status-distribution",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.dashboard],
    }),
    partnerDistribution: build.query({
      query: (arg) => ({
        url: "/dashboard/partner-distribution",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.dashboard],
    }),
    topSellingProducts: build.query({
      query: (arg) => ({
        url: "/dashboard/top-selling-products",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.dashboard],
    }),
    getAgentDashboardSummary: build.query({
      query: (arg) => ({
        url: "/dashboard/agent-summary",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dashboard],
    }),
    getAreaDistribution: build.query({
      query: (params) => ({
        url: "/dashboard/area-distribution",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.dashboard],
    }),
  }),
});

export const {
  useGetMonthlySalesReportQuery,
  useGetDashboardSummaryQuery,
  useStatusDistributionQuery,
  usePartnerDistributionQuery,
  useTopSellingProductsQuery,
  useGetAgentDashboardSummaryQuery,
  useGetAreaDistributionQuery,
} = dashboardApi;
