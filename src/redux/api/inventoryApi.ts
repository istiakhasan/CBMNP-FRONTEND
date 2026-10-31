import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateInventory: build.mutation({
      query: (data) => ({
        url: "/inventory",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.inventory],
    }),
    revalidateStock: build.mutation({
      query: () => ({
        url: "/inventory/reconcile-order-counters",
        method: "POST",
        data: { confirm: "REBUILD_ORDER_COUNTERS" },
      }),
      invalidatesTags: [tagTypes.inventory],
    }),
    loadAllInventory: build.query({
      query: (arg) => ({
        url: "/inventory",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.inventory],
    }),
    warehouseWiseProductStock: build.query({
      query: (arg) => ({
        url: "/inventory/warehouse-wise-stock",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.inventory],
    }),
    loadStockByProductIdAndLocationId: build.query({
      query: (arg) => ({
        url: "/inventory/getbywarehouseproduct",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.inventory],
    }),
    loadAllTransaction: build.query({
      query: (arg) => ({
        url: "/transaction",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.warehouse],
    }),
    loadTransactionById: build.query({
      query: (arg) => ({
        url: `/transaction/findById/${arg?.id}`,
        method: "GET",
        params: arg?.params
      }),
      providesTags: [tagTypes.warehouse],
    }),
    loadStockByProductid: build.query({
      query: (arg) => ({
        url: `/inventory/${arg?.id}`,
        method: "GET"
      }),
      providesTags: [tagTypes.warehouse],
    }),
  }),
});

export const {
    useLoadAllInventoryQuery,
    useLoadAllTransactionQuery,
    useLoadTransactionByIdQuery,
    useLazyLoadTransactionByIdQuery,
    useLoadStockByProductidQuery,
    useLoadStockByProductIdAndLocationIdQuery,
    useLazyLoadStockByProductIdAndLocationIdQuery,
    useUpdateInventoryMutation,
    useRevalidateStockMutation,
    useWarehouseWiseProductStockQuery
} = inventoryApi;
