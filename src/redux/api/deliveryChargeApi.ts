import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
export const deliveryChargeApi=baseApi.injectEndpoints({
    endpoints:(build)=>({
        getDeliveryCharge:build.query({
            query:(arg)=>({
                url:`/delivary-charge/${arg?.id}`,
                method:"GET"
            }),
            providesTags:[tagTypes.delivery]
        }),
    })
})
export const {useGetDeliveryChargeQuery}=deliveryChargeApi
