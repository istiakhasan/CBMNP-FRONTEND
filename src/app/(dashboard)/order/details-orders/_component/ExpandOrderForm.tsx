import React, { useMemo, useState } from 'react';
import { message } from 'antd';
import GbForm from '@/components/forms/GbForm';
import { useApprovedOrderMutation } from '@/redux/api/orderApi';
import FormWraper from './FormWraper';

const ExpandOrderForm = ({ i, item,derivateData,expand,setExpand }: any) => {
    const [productData, setProductData] = useState([]);
    const [approvedOrderHandler] = useApprovedOrderMutation()
    const formSubmit = async (formData: any) => {
        try {
            const payload = { ...item }
            payload['orderStatus'] = Number(formData['orderStatus']?.value)
            payload['shippingAddressDivision'] = formData['shippingAddressDivision']?.label
            payload['shippingAddressDistrict'] = formData['shippingAddressDistrict']?.label
            payload['shippingAddressThana'] = formData['shippingAddressThana']?.label
            payload['paymentMethods'] = formData['payment_method']?.value
            payload['employeeId'] = "10193"
            //  payload['employeeId']=userInfo?.employeeId
            payload['orderStatus'] = {
                name: formData['orderStatus']?.label,
                value: formData['orderStatus']?.value,
            }
            if (formData?.newDeliveryCharge) {
                payload["deliveryCharge"] = formData?.newDeliveryCharge
            }
            payload['orderStatusValue'] = formData['orderStatus']?.value
            payload['isApprove'] = true
                const modifyProductData = productData.map((item:any) => ({
                 ...item,
                 orderId: item?.id
               }));
                payload['totalPurchaseAmount']=productData.reduce((acc:any, order:any) => acc + order.subTotal, 0);

            payload['orderDetails']=modifyProductData
            const res = await approvedOrderHandler({ id: payload.id, data: payload })
            if (res) {
                message.success('Order update successfully...')
            }
        } catch (error) {
            message.error("Something went wrong")
        }
    };
    useMemo(()=>{setProductData(item?.order_info)},[item])
    return (
        <GbForm defaultValues={{
            orderStatus: {
                label: item?.orderStatus?.name,
                value: item?.orderStatus?.value
            },
            orderFrom: item?.orderFrom,
            shippingAddressDistrict: {
                label: item?.shippingAddressDistrict,
                value: item?.shippingAddressDistrict
            },
            shippingAddressDivision: {
                label: item?.shippingAddressDivision,
                value: item?.shippingAddressDivision
            },
            shippingAddressThana: {
                label: item?.shippingAddressThana,
                value: item?.shippingAddressThana
            },
            payment_method: {
                label: item?.last_transaction?.paymentMethods,
                value: item?.last_transaction?.paymentMethods
            },
        }} submitHandler={formSubmit}>
           <FormWraper expand={expand} setExpand={setExpand} derivateData={derivateData} item={item} i={i} productData={productData} setProductData={setProductData}  />
        </GbForm>
    );
};

export default ExpandOrderForm;