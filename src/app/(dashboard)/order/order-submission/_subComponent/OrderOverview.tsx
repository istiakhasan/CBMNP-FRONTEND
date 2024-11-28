"use client"
import { useFormContext } from "react-hook-form";

const OrderOverview = () => {
    const {watch}=useFormContext()
        return (
        <div className='sdw_box'>
            <p className='text-[#000000] text-[12px] font-[400] mb-[20px] '>February 9, 2015</p>
            <div>
                <div >
                    <table className='order_overview'>
                        <tbody>
                            <tr>
                                <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>Biller</p></td>
                                <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>Receiver</p></td>
                            </tr>
                            <tr>
                                <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>{watch()?.probashi?watch()?.probashi_name:watch()?.customerName || "--"}</p></td>
                                <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>{watch()["isSameAsBillingAddress"]?watch()?.receiverName:watch()?.customerName}</p></td>
                            </tr>
                            <tr>
                                <td><p className='text-[#000000] text-[12px] font-[400] '>{watch()?.probashi?watch()?.probashi_number:watch()?.customerPhoneNumber || "--"}</p></td>
                                <td><p className='text-[#000000] text-[14px] font-[400] '>{watch()["isSameAsBillingAddress"]?watch()?.receiverPhoneNumber:watch()?.customerPhoneNumber || ""}</p></td>
                            </tr>
                            <tr>
                                <td><p className='text-[#000000] text-[12px] font-[400]  '>{watch()?.probashi?watch()?.probashi_address:watch()?.billingAddressTextArea || "--"}</p></td>
                                <td><p className='text-[#000000] text-[14px] font-[400]  '>{watch()["isSameAsBillingAddress"]?watch()?.shippingAddressTextArea:watch()?.billingAddressTextArea || ""}</p></td>
                            </tr>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                    <div className="bg-[#F7F9FB] flex justify-between items-center rounded-[5px] mb-[4px]">
                        <p className='text-[#000000] text-[14px] font-[500] p-[10px] '>Name</p>
                        <p className='text-[#000000] text-[14px] font-[500] p-[10px] '>Quantity</p>
                        <p className='text-[#000000] text-[14px] font-[500] p-[10px] '>Price</p>
                    </div>
                    <div className="bg-[#F7F9FB] flex justify-between items-center rounded-[5px]">
                        <p className='text-[#000000] text-[14px] font-[500] p-[10px] '>Black seed honey 1kg</p>
                        <p className='text-[#000000] text-[14px] font-[500] p-[10px] '>1</p>
                        <p className='text-[#000000] text-[14px] font-[500] p-[10px] '>1600</p>
                    </div>
                    <table className='order_overview'>
                        <tbody>
                            <tr>
                                <td className="flex">
                                    <p className='text-[#000000] text-[12px] font-[400] '>Confirm by :</p>
                                    <p className='text-[#000000] text-[12px] font-[500] '> Tareq Mahmud</p>
                                </td>

                                <td className="px-[10px]">
                                    <div className="flex justify-between">
                                        <p className='text-[#000000] text-[12px] font-[400] text-end'>Sub total</p>
                                        <p className='text-[#000000] text-[12px] font-[500] text-end'>2400</p>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <td className="flex">
                                    <p className='text-[#000000] text-[12px] font-[500] '>Note :</p>
                                    <p className='text-[#000000] text-[12px] font-[500] '> --</p>
                                </td>

                                <td className="px-[10px]">
                                    <div className="flex justify-between">
                                        <p className='text-[#000000] text-[12px] font-[400] text-end'>Delivery charge</p>
                                        <p className='text-[#000000] text-[12px] font-[500] text-end'>00</p>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <td> </td>

                                <td className="px-[10px]">
                                    <div className="flex justify-between">
                                        <p className='text-[#000000] text-[12px] font-[400] text-end'>Discount</p>
                                        <p className='text-[#000000] text-[12px] font-[500] text-end'>00</p>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <td> </td>

                                <td className="px-[10px]">
                                    <div className="flex justify-between">
                                        <p className='text-[#000000] text-[12px] font-[400] text-end'>Total</p>
                                        <p className='text-[#000000] text-[12px] font-[500] text-end'>2400</p>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderOverview;