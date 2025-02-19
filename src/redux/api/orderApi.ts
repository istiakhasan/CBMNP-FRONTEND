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
		getAllOrders: build.query({
			query: (arg) => ({
				url: "/orders",
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
				url: `/orders/change-status/${arg?.id}`,
				method: "PATCH",
				data:arg?.data
			}),
			invalidatesTags: [tagTypes.order],
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
	useGetOrdersLogsQuery
} = orderApi;
