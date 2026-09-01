import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const governanceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBranches: build.query({
      query: () => ({ url: "/governance/branches", method: "GET" }),
      providesTags: [tagTypes.governance],
    }),
    createBranch: build.mutation({
      query: (data) => ({ url: "/governance/branches", method: "POST", data }),
      invalidatesTags: [tagTypes.governance],
    }),
    getAuditLogs: build.query({
      query: (params) => ({ url: "/governance/audit-logs", method: "GET", params }),
      providesTags: [tagTypes.governance],
    }),
    getLoginLogs: build.query({
      query: () => ({ url: "/governance/login-history", method: "GET" }),
      providesTags: [tagTypes.governance],
    }),
    getApprovalRules: build.query({
      query: () => ({ url: "/governance/approval-rules", method: "GET" }),
      providesTags: [tagTypes.governance],
    }),
    setApprovalRule: build.mutation({
      query: (data) => ({ url: "/governance/approval-rules", method: "POST", data }),
      invalidatesTags: [tagTypes.governance],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useGetAuditLogsQuery,
  useGetLoginLogsQuery,
  useGetApprovalRulesQuery,
  useSetApprovalRuleMutation,
} = governanceApi;
