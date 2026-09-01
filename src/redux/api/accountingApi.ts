import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const accountingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Chart of Accounts
    getChartOfAccountsTree: build.query({
      query: () => ({
        url: "/accounting/accounts/tree",
        method: "GET",
      }),
      providesTags: [tagTypes.accounting],
    }),
    getAccountsList: build.query({
      query: () => ({
        url: "/accounting/accounts",
        method: "GET",
      }),
      providesTags: [tagTypes.accounting],
    }),
    createAccount: build.mutation({
      query: (data) => ({
        url: "/accounting/accounts",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.accounting],
    }),
    updateAccount: build.mutation({
      query: ({ id, data }) => ({
        url: `/accounting/accounts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.accounting],
    }),
    deleteAccount: build.mutation({
      query: (id) => ({
        url: `/accounting/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.accounting],
    }),

    // Journal Entries
    getJournalEntries: build.query({
      query: (params) => ({
        url: "/accounting/journal-entries",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.accounting],
    }),
    getJournalEntryById: build.query({
      query: (id) => ({
        url: `/accounting/journal-entries/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.accounting],
    }),
    createJournalEntry: build.mutation({
      query: (data) => ({
        url: "/accounting/journal-entries",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.accounting],
    }),
    voidJournalEntry: build.mutation({
      query: (id) => ({
        url: `/accounting/journal-entries/${id}/void`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.accounting],
    }),

    // Financial Reports
    getGeneralLedger: build.query({
      query: (params) => ({
        url: "/accounting/reports/general-ledger",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.accounting],
    }),
    getTrialBalance: build.query({
      query: (params) => ({
        url: "/accounting/reports/trial-balance",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.accounting],
    }),
    getProfitAndLoss: build.query({
      query: (params) => ({
        url: "/accounting/reports/profit-loss",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.accounting],
    }),
    getBalanceSheet: build.query({
      query: (params) => ({
        url: "/accounting/reports/balance-sheet",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.accounting],
    }),
  }),
});

export const {
  useGetChartOfAccountsTreeQuery,
  useGetAccountsListQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetJournalEntriesQuery,
  useGetJournalEntryByIdQuery,
  useCreateJournalEntryMutation,
  useVoidJournalEntryMutation,
  useGetGeneralLedgerQuery,
  useGetTrialBalanceQuery,
  useGetProfitAndLossQuery,
  useGetBalanceSheetQuery,
} = accountingApi;
