import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActivityLogs: build.query({
      query: (params) => ({ url: "/activity-logs", method: "GET", params }),
      providesTags: [tagTypes.activityLogs],
    }),
    createActivityLog: build.mutation({
      query: (data) => ({ url: "/activity-logs", method: "POST", data }),
      invalidatesTags: [tagTypes.activityLogs],
    }),
  }),
});

export const { useGetActivityLogsQuery, useCreateActivityLogMutation } =
  activityLogApi;
