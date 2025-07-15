import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import { numberToWords } from "@/util/commonUtil";
import moment from "moment";

/* eslint-disable @next/next/no-img-element */
const GlobalInvoice = ({rowDto}:any) => {
  const {data}=useGetOrganizationByIdQuery(undefined)
    const organization=data?.data
  console.log(rowDto,"row dto",organization);
    return (
      <div className="container mx-auto p-2  rounded-lg bg-white">
        {/* Header */}
        <div className="relative text-center">
          <div className="absolute left-8 top-16">
            <img
              className="h-16"
              src="https://thumbs.dreamstime.com/b/jp-logo-letter-monogram-triangle-shape-design-template-jp-logo-letter-monogram-triangle-shape-design-template-isolated-175257710.jpg"
              alt="logo"
            />
          </div>
          <div className="mb-10">
            <p className="text-2xl font-bold uppercase">
              <span className="bg-black text-white px-2">{organization?.name.split(' ').map((item:any)=>item?.slice(0,1)).join('')}</span> {organization?.name}
            </p>
            <p className="text-lg">
              <span>Address: {organization?.address}</span>
              {/* <br />
              <span>Email: demo@jimpower.ltd</span>, <span>Web: www.jimpower-bd.com</span> */}
              <br />
              <span>Hotline: {organization?.phone}</span>
            </p>
            <p className="text-2xl font-bold">Invoice (Bill/Challan)</p>
          </div>
        </div>
        
        {/* Buyer & Invoice Details */}
        <div className="flex justify-between">
          <div>
            <p><span className="font-bold">Po No: </span>{rowDto?.invoiceNumber}</p>
            <p><span className="font-bold">Contact Person: </span>{rowDto?.supplier?.contactPerson}</p>
            <p><span className="font-bold">Mobile: </span>{rowDto?.supplier?.phone}</p>
          </div>
          <div>
            <p><span className="font-bold">Date: </span>{moment(rowDto?.createdAt).format('YYYY-MM-DD')}</p>
            <p><span className="font-bold">Time: </span>{moment(rowDto?.createdAt).format('hh:mm A')}</p>
            {/* <p><span className="font-bold">Office Name: </span>Jim Power Ltd</p> */}
            <p><span className="font-bold">User Name: </span>{rowDto?.createdBy?.name}</p>
          </div>
        </div>
        
        {/* Table */}
        <table className="w-full border border-collapse mt-4">
          <thead>
            <tr className="border">
              <th align="left" className="border p-2">Sl</th>
              <th align="left" className="border p-2">Code</th>
              <th align="left" className="border p-2">Products</th>
              <th className="border p-2">QTY</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Discount</th>
              <th align="right" className="border p-2">Total Amount (Tk)</th>
            </tr>
          </thead>
          <tbody>
            {
              rowDto?.items?.map((item:any,i:any)=>(
                <tr key={i} className="border">
              <td className="border p-2">{i+1}</td>
              <td className="border p-2">N/A</td>
              <td className="border p-2">{item?.product?.name}</td>
              <td align="center" className="border p-2">{item?.orderedQuantity}</td>
              <td align="center" className="border p-2">{item?.unitPrice}</td>
              <td align="center" className="border p-2">N/A</td>
              <td align="right" className="border p-2">{item?.totalPrice}</td>
            </tr>
              ))
            }
          </tbody>
        </table>
        
        {/* Summary Section */}
        <div className="flex justify-between mt-4">
          <p><strong>Amount In Words:</strong> {numberToWords(rowDto?.billAmount)}</p>
          <table className="w-2/5">
            <tbody>
              <tr>
                <td className="">Item Total :</td>
                <td className="text-right">{rowDto?.items?.reduce((a:any,b:any)=>a+Number(b.totalPrice),0)} Tk</td>
              </tr>
              <tr>
                <td className="">Total Discount:</td>
                <td className="text-right">0 Tk</td>
              </tr>
              <tr>
                <td className="">Others Cost:</td>
                <td className="text-right">0 Tk</td>
              </tr>
              <tr style={{borderTop:"1px solid "}}>
                <td className="font-bold">Grand Total:</td>
                <td className="text-right">{rowDto?.billAmount} Tk</td>
              </tr>
            
            </tbody>
          </table>
        </div>
        
        {/* Signature Section */}
        <div className="flex justify-between mt-[150px] pt-5 ">
          <p className="text-center border-t w-1/3">{"Receiver's Signature"}</p>
          <p className="text-center border-t w-1/3">Authorized Signature</p>
        </div>
      </div>
    );
  };
  
  export default GlobalInvoice;
  