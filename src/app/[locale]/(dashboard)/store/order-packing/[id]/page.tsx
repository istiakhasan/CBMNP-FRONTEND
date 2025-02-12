"use client"
import ProductInfoTable from "@/app/(dashboard)/order/order-submission/_subComponent/ProductInfoTable";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { Col, Row } from "antd";

const Page = () => {
    return (
        <>
            <GbHeader title="Paking product details" />
            <Row gutter={70}>
                <Col sm={12} md={14}>
                    <div className="sdw_box mb-[20px]">
                        <div className="grid grid-cols-2">
                            <div>
                                <h1 className="text-[#343434] text-[20px] font-[600] mb-[45px]">#21254</h1>
                                {/* biller info */}
                                <div className="mb-[18px]">
                                    <h1 className="text-[#343434] text-[20px] font-[600] mb-[6px]">Biller</h1>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">Brooklyn Simmons</p>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">6391 Elgin St. Celina, Delaware 10299</p>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">(307) 555-0133</p>
                                </div>
                                {/* Payment info */}
                                <div className="mb-[18px]">
                                    <h1 className="text-[#343434] text-[20px] font-[600] mb-[6px]">Payment info</h1>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">Cash on delivery</p>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-[#343434] text-[20px] font-[600] mb-[8px]">Order creation date</h1>
                                <h1 className="text-[#343434] text-[16px] font-[500] mb-[20px]">June 04,2024</h1>
                                {/* biller info */}
                                <div className="mb-[18px]">
                                    <h1 className="text-[#343434] text-[20px] font-[600] mb-[6px]">Receiver</h1>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">Brooklyn Simmons</p>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">6391 Elgin St. Celina, Delaware 10299</p>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">(307) 555-0133</p>
                                </div>
                                {/* Payment info */}
                                <div className="mb-[18px]">
                                    <h1 className="text-[#343434] text-[20px] font-[600] mb-[6px]">Delivery info</h1>
                                    <div className="flex justify-between">
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">Express delivery</p>
                                    <p className="text-[#7D7D7D] text-[16px] font-[500] mb-[12px]">Steadfast</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sdw_box">
                                <h1 className="text-[#343434] text-[20px] font-[600] mb-[45px]">Product info</h1>
                                <table className="product_info_details_table">
                <thead>
                    <tr>
                        <th className="text-start"><span>Bar code</span></th>
                        <th className="text-start w-[200px]"><span>Name</span></th>
                        <th className="text-center"><span>Quantity</span></th>
                        <th className="text-center"><span>Price</span></th>
                    </tr>
                </thead>
                <tbody>
                   {
                    [...Array(5).keys()].map((item)=>(
                        <tr key={item}>
                            <td>124587</td>
                            <td>Honey nuts 800gm</td>
                            <td className="text-center">04</td>
                            <td className="text-center">1200</td>
                        </tr>
                    ))
                   }
                </tbody>
            </table>
                    </div>
                </Col>
                <Col sm={12} md={10}>
                    <div className="sdw_box">
                      <p className="text-[14px] font-[500] text-[#000000]">Product bar code scan  </p>
                      <button className="h-[44px] bg-[#F7F9FB] inline-block w-full rounded-sm"></button>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default Page; 