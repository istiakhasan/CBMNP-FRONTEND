import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (data) => ({
        url: "/user",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.users],
    }),
    getAllUsers: build.query({
      query: (arg) => ({
        url: "/user",
        method: "GET",
        params:arg
      }),
      providesTags: [tagTypes.users],
    }),
    getAllUsersOptions: build.query({
      query: (arg) => ({
        url: "/user/options",
        method: "GET",
        params:arg
      }),
      providesTags: [tagTypes.users],
    }),
    getUserById: build.query({
      query: (arg) => ({
        url: `/user/${arg.id}`,
        method: "GET"
      }),
      providesTags: [tagTypes.users],
    }),
    updateUserById: build.mutation({
      query: (arg) => ({
        url: `/user/${arg.id}`,
        method: "PATCH",
        data:arg?.data
      }),
      invalidatesTags: [tagTypes.users],
    }),
  }),
});

export const {
 useCreateUserMutation,
 useGetAllUsersQuery,
 useGetUserByIdQuery,
 useUpdateUserByIdMutation,
 useGetAllUsersOptionsQuery
} = userApi;
