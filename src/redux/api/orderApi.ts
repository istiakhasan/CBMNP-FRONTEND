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
		getOrderById: build.query({
			query: (arg) => ({
				url: `/order/${arg.id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.order],
		}),
		getOrdersByPhoneNumber: build.query({
			query: (arg) => ({
				url: `/order/subscriber-orders?phone=${arg?.id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.order],
		}),
		approvedOrder: build.mutation({
			query: (data) => ({
				url: `/order/${data?.id}`,
				method: "PATCH",
				data: data?.data,
			}),
			invalidatesTags: [tagTypes.order],
		}),
		orderStatistics: build.query({
			query: (data) => ({
				url: `/order/product-analysis?phone=${data?.number}`,
				method: "GET",
			}),
			providesTags: [tagTypes.order],
		}),
	}),
});

export const {
	useGetAllOrdersQuery,
	useGetOrderByIdQuery,
	useApprovedOrderMutation,
	useGetAllOrderStatusQuery,
	useCreateOrderMutation,
	useGetOrdersByPhoneNumberQuery,
	useOrderStatisticsQuery
} = orderApi;
