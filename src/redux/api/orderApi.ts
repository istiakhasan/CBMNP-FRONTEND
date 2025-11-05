import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
export const orderApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createOrder: build.mutation({
			query: (data) => ({
				url: "/orders",
				method: "POST",
				data
			}),
			invalidatesTags: [tagTypes.order],
		}),
		createPOSOrder: build.mutation({
			query: (data) => ({
				url: "/orders/pos",
				method: "POST",
				data
			}),
			invalidatesTags: [tagTypes.order],
		}),
		getAllOrders: build.query({
			query: (arg) => ({
				url: "/orders",
				method: "GET",
				params: arg,
			}),
			providesTags: [tagTypes.order],
		}),
		getOrdersReports: build.query({
			query: (arg) => ({
				url: "/orders/reports",
				method: "GET",
				params: arg,
			}),
			providesTags: [tagTypes.order],
		}),
		getProductWiseSalesReport: build.query({
			query: (arg) => ({
				url: "/orders/product-sales-report",
				method: "GET",
				params: arg,
			}),
			providesTags: [tagTypes.order],
		}),
		getAllOrderStatus: build.query({
			query: (arg) => ({
				url: "/order-status",
				method: "GET",
				params: arg,
			}),
			providesTags: [tagTypes.order],
		}),
		changeOrderStatus: build.mutation({
			query: (arg) => ({
				url: `/orders/change-status/`,
				method: "PATCH",
				data:arg
			}),
			invalidatesTags: [tagTypes.order],
		}),
		changeHoldOrderStatus: build.mutation({
			query: (arg) => ({
				url: `/orders/change-hold-status`,
				method: "PATCH",
				data:arg
			}),
			invalidatesTags: [tagTypes.order],
		}),
		returnOrders: build.mutation({
			query: (arg) => ({
				url: `/orders/return`,
				method: "PATCH",
				data:arg
			}),
			invalidatesTags: [tagTypes.order],
		}),
		deliveryPartnerReport: build.query({
			query: (arg) => ({
				url: `/orders/delivery-partner-report`,
				method: "GET",
				params:arg
			}),
			providesTags: [tagTypes.order],
		}),
		getOrdersLogs: build.query({
			query: (arg) => ({
				url: `/orders/logs/${arg?.id}`,
				method: "GET"
			}),
			providesTags: [tagTypes.order],
		}),
		getOrderById: build.query({
			query: (arg) => ({
				url: `/orders/${arg.id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.order],
		}),
		getScanOrderById: build.query({
			query: (arg) => ({
				url: `/orders/scan/${arg.id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.order],
		}),
		updateOrder: build.mutation({
			query: (data) => ({
				url: `/orders/${data?.id}`,
				method: "PATCH",
				data: data?.data,
			}),
			invalidatesTags: [tagTypes.order],
		}),
		addPayment: build.mutation({
			query: (data) => ({
				url: `/orders/payment/${data?.id}`,
				method: "POST",
				data: data?.data,
			}),
			invalidatesTags: [tagTypes.order],
		}),
	
	}),
});

export const {
	useGetAllOrdersQuery,
	useGetOrderByIdQuery,
	useLazyGetOrderByIdQuery,
	useUpdateOrderMutation,
	useGetAllOrderStatusQuery,
	useCreateOrderMutation,
	useAddPaymentMutation,
	useChangeOrderStatusMutation,
	useGetOrdersLogsQuery,
	useChangeHoldOrderStatusMutation,
	useReturnOrdersMutation,
	useCreatePOSOrderMutation,
	useLazyGetAllOrdersQuery,
	useLazyGetOrdersReportsQuery,
	useLazyGetProductWiseSalesReportQuery,
	useDeliveryPartnerReportQuery,
	useLazyDeliveryPartnerReportQuery,
	useGetScanOrderByIdQuery,
	useLazyGetScanOrderByIdQuery
} = orderApi;
