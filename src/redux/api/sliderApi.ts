import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const sliderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    uploadSlider: build.mutation({
      query: (data) => ({
        url: "/slider",
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.slider],
    }),
    deleteSlider: build.mutation({
      query: (data) => ({
        url: `/slider/${data?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.slider],
    }),
    getAllSlider: build.query({
      query: () => ({
        url: "/slider",
        method: "GET"
      }),
      providesTags: [tagTypes.slider],
    }),
 
  }),
});

export const {
 useUploadSliderMutation,
 useGetAllSliderQuery,
 useDeleteSliderMutation
} = sliderApi;
