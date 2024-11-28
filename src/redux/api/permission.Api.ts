import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // createUser: build.mutation({
    //   query: (data) => ({
    //     url: "/user",
    //     method: "POST",
    //     data,
    //   }),
    //   invalidatesTags: [tagTypes.users],
    // }),
    getAllPermissionLabel: build.query({
      query: (arg) => ({
        url: "/permission",
        method: "GET",
        params:arg
      }),
      providesTags: [tagTypes.users],
    }),
  }),
});

export const {
//  useCreateUserMutation,
 useGetAllPermissionLabelQuery,
} = permissionApi;
