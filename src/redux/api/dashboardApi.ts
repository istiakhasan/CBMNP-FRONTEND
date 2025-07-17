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
  }),
});

export const {
    useGetMonthlySalesReportQuery,
} = dashboardApi;
