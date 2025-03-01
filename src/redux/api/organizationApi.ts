import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // createUser: build.mutation({
    //   query: (data) => ({
    //     url: "/user",
    //     method: "POST",
    //     data,
    //   }),
    //   invalidatesTags: [tagTypes.users],
    // }),
    getOrganizationById: build.query({
      query: () => ({
        url: "/organization/get-by-id",
        method: "GET"
      }),
      providesTags: [tagTypes.users],
    }),
  }),
});

export const {
//  useCreateUserMutation,
 useGetOrganizationByIdQuery
} = organizationApi;
