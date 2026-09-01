import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const financeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Bank Accounts
    getBankAccounts: build.query({
      query: () => ({ url: "/finance/bank-accounts", method: "GET" }),
      providesTags: [tagTypes.finance],
    }),
    createBankAccount: build.mutation({
      query: (data) => ({ url: "/finance/bank-accounts", method: "POST", data }),
      invalidatesTags: [tagTypes.finance],
    }),

    // Expenses
    getExpenseCategories: build.query({
      query: () => ({ url: "/finance/expense-categories", method: "GET" }),
      providesTags: [tagTypes.finance],
    }),
    createExpenseCategory: build.mutation({
      query: (data) => ({ url: "/finance/expense-categories", method: "POST", data }),
      invalidatesTags: [tagTypes.finance],
    }),
    getExpenses: build.query({
      query: (params) => ({ url: "/finance/expenses", method: "GET", params }),
      providesTags: [tagTypes.finance],
    }),
    createExpense: build.mutation({
      query: (data) => ({ url: "/finance/expenses", method: "POST", data }),
      invalidatesTags: [tagTypes.finance, tagTypes.accounting],
    }),

    // Fund Transfers
    transferFunds: build.mutation({
      query: (data) => ({ url: "/finance/fund-transfers", method: "POST", data }),
      invalidatesTags: [tagTypes.finance, tagTypes.accounting],
    }),

    // Receivables (AR)
    getCustomerLedger: build.query({
      query: ({ customerId, ...params }) => ({
        url: `/finance/receivables/customer-ledger/${customerId}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.finance],
    }),
    getCustomerAgingReport: build.query({
      query: () => ({ url: "/finance/receivables/aging-report", method: "GET" }),
      providesTags: [tagTypes.finance],
    }),

    // Payables (AP)
    getSupplierBills: build.query({
      query: (params) => ({ url: "/finance/payables/supplier-bills", method: "GET", params }),
      providesTags: [tagTypes.finance],
    }),
    createSupplierBill: build.mutation({
      query: (data) => ({ url: "/finance/payables/supplier-bills", method: "POST", data }),
      invalidatesTags: [tagTypes.finance],
    }),
    recordSupplierPayment: build.mutation({
      query: (data) => ({ url: "/finance/payables/supplier-payments", method: "POST", data }),
      invalidatesTags: [tagTypes.finance, tagTypes.accounting],
    }),
    getSupplierLedger: build.query({
      query: (supplierId) => ({ url: `/finance/payables/supplier-ledger/${supplierId}`, method: "GET" }),
      providesTags: [tagTypes.finance],
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useCreateBankAccountMutation,
  useGetExpenseCategoriesQuery,
  useCreateExpenseCategoryMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useTransferFundsMutation,
  useGetCustomerLedgerQuery,
  useGetCustomerAgingReportQuery,
  useGetSupplierBillsQuery,
  useCreateSupplierBillMutation,
  useRecordSupplierPaymentMutation,
  useGetSupplierLedgerQuery,
} = financeApi;
