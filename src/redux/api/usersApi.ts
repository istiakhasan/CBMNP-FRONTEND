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
  }),
});

export const {
 useCreateUserMutation,
 useGetAllUsersQuery,
} = userApi;
