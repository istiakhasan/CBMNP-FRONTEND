
import { message, Rate } from "antd";
const OrderSubmissionProductInfoTable = ({
  productData,
  setProductData,
  isShow=true
}: {
  setProductData?: any;
  productData?: any;
  isShow?:any
}) => {
  return (
    <div>
      <table className="product_info_details_table">
        <thead>
          <tr>
            <th></th>
            <th className="text-start">
              <span>Name</span>
            </th>
           {isShow && <th className="text-start">
              <span>Manage</span>
            </th>}
            <th className="text-start">
              <span>Quantity</span>
            </th>
            <th className="text-start">
              <span>Price</span>
            </th>
            <th className="text-end">
              <span>Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {productData?.map((item: any, i: any) => (
            <tr key={i}>
              <td>
                <Rate onChange={() => {}} count={1} />
              </td>
              <td>
                <span>{item?.productNameEn}</span>
              </td>
              {isShow &&<td>
                <div className="bg-[white] flex items-center justify-between w-fit">
                  <i onClick={()=>{
                    const newQuantity=+item?.productQuantity+1 
                    const _data=[...productData]
                    _data[i].productQuantity=newQuantity 
                    _data[i].subTotal=_data[i].productQuantity * _data[i].current_prices
                    setProductData(_data)
                  }} className="ri-add-fill cursor-pointer  text-[20px]  text-[#12354C] bg-white w-[40px] flex items-center justify-center h-[40px]"></i>
                  <input 
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    const numberValue = Number(value);
                    if (isNaN(numberValue)) {
                        return message.error("Must input numbers");
                    }
                    if (numberValue < 1) {
                        return message.error("Quantity can't be less than 1");
                    }

                    if (numberValue === 0 && value !== '') {
                        return message.error("Quantity can't be zero");
                    }
                    const _data = [...productData];
                    _data[i].productQuantity = numberValue;
                    _data[i].subTotal=_data[i].productQuantity * _data[i].current_prices
                    setProductData(_data);
                }}
                
                    value={item?.productQuantity}
                    className=" text-[16px] text-center  min-w-[40px] w-[60px] outline-none h-[40px]"
                    type="text"
                  />
                  <i onClick={()=>{
                      const newQuantity=item?.productQuantity-1 
                      if(newQuantity<1){
                       return message.error('Quantity can not be zerro')
                      }
                    const _data=[...productData]
                    _data[i].productQuantity=newQuantity 
                    _data[i].subTotal=_data[i].productQuantity * _data[i].current_prices
                    setProductData(_data)
                  }} className="ri-subtract-fill cursor-pointer  text-[20px]  text-[#12354C] bg-white w-[40px] flex items-center justify-center h-[40px]"></i>
                </div>
              </td>}
              <td>
                <span>{item?.productQuantity}</span>
              </td>
              <td>
                <span>{item?.subTotal}</span>
              </td>
              <td>
                <div className="flex justify-end gap-[10px]">
                  <i
                    onClick={() => {
                      const _data = [...productData];
                      _data.splice(i, 1);
                      setProductData(_data);
                    }}
                    className="ri-delete-bin-line text-[18px] cursor-pointer"
                  ></i>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderSubmissionProductInfoTable;
