const CustomerOverview = () => {
    return (
        <div className='sdw_box'>
            <div className='grid grid-cols-3 gap-[54px]'>
                <div>
                    <p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>15486511547841</p>
                    <p className='text-[#000000] text-[14px] font-[500]'>Receiver</p>

                    <div>
                    <span className='text-[#000000] text-[12px] font-[400]'>Aslam Munshi</span>
                        <span className='text-[#000000] text-[12px] font-[400] block'>01758260451</span>
                        <span className='text-[#000000] text-[12px] font-[400]'>House 05, Block C, Road 03, Rampura, Dhaka 1218</span>
                    </div>
                </div>
              <div className='col-span-2'>
              <table className='overview_table'>
                    <tbody>
                        <tr>
                            <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>Total Price(Taka)</p></td>
                            <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>300</p></td>
                        </tr>
                        <tr>
                            <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>Product</p></td>
                            <td><p className='text-[#000000] text-[14px] font-[500] mb-[12px] '>Quantity</p></td>
                        </tr>
                        <tr>
                            <td><p className='text-[#000000] text-[12px] font-[400] '>Shundarban honey 1kg</p></td>
                            <td><p className='text-[#000000] text-[14px] font-[500] '>1</p></td>
                        </tr>
                        <tr>
                            <td><p className='text-[#000000] text-[12px] font-[400]  '>Shundarban honey 1kg</p></td>
                            <td><p className='text-[#000000] text-[14px] font-[500]  '>1</p></td>
                        </tr>
                        <tr>
                            <td><p className='text-[#000000] text-[12px] font-[400] '>Shundarban honey 1kg</p></td>
                            <td><p className='text-[#000000] text-[14px] font-[500]  '>1</p></td>
                        </tr>
                        <tr>
                       <td colSpan={2}>
                       <div className='flex items-center justify-end gap-[8px] mt-3'>
                         <button className='border-[1px]  text-nowrap active_button border-[#4E9EFC] text-[10px] px-[18px] py-[6px] rounded-[5px] custom_overview_active_btn'>Delivered</button>
                            <button className='border-[1px] text-nowrap  border-[#4E9EFC] text-[10px] px-[18px] py-[6px] rounded-[5px]'>Re-order</button>
                            <button className='border-[1px] text-nowrap  border-[#4E9EFC] text-[10px] px-[18px] py-[6px] rounded-[5px]'>View details</button>
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

export default CustomerOverview;