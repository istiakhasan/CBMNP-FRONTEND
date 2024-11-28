"use client";
import { SearchOutlined } from "@ant-design/icons";
import { useGetAllProductBySearchQuery } from "@/redux/api/productApi";
import { useEffect, useState, FC } from "react";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { Image, message } from "antd";
interface Product {
  id: number;
  current_prices: number;
  product_title_en: string;
  product_image: string;
  productQuantity?: number;
}

interface ProductEntity {
  productId: number;
  current_prices: number;
  productNameEn: string;
  singleProductPrices: number;
  productQuantity: number;
  subTotal: number;
  orderId?: number;
  isCancel: boolean;
}

interface AddProductProps {
  setIsModalOpen: (isOpen: boolean) => void;
  productData: ProductEntity[];
  setProductData: any;
  orderId?: number;
}

const AddProductVtwo: FC<AddProductProps> = ({ setIsModalOpen, productData, setProductData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data } = useGetAllProductBySearchQuery({ searchProducts: searchTerm ,limit:"200"});
  const [loadData, setLoadData] = useState<Product[]>([]);

  useEffect(() => {
    if (data) {
      const modifyData=data?.data?.map((item:any)=>{
        return {
          ...item,
          productQuantity: productData?.find(pd=>pd.productId===item?.id)?.productQuantity || 0
        }
      })
      setLoadData(modifyData);
    }
  }, [data]);

  return (
    <div>
      <div className="sdw_box rounded-none p-[10px]">
        {/* <h1 className="box_title mb-1">Product Info</h1> */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-3 rounded-md">
          <SearchOutlined className="text-lg text-gray-400" />
          <input
            className="flex-grow bg-gray-100 border-none outline-none text-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
        </div>
      </div>

      <div className=" max-h-[300px] mb-[40px] overflow-auto custom_scroll">
        <table className="product_info_table w-full">
          <tbody>
            {loadData.map((item, i) => (
              <tr key={item.id}>
                <td>
                  <Image 
                    preview={false}
                    src={`${getBaseUrl()}/${item.product_image}`}
                    alt="Product"
                    width={42}
                    height={42}
                  />
                </td>
                <td>
                  <p className="text-gray-900 text-sm font-normal mb-2">{item.product_title_en}</p>
                  <p className="text-gray-900 text-sm font-medium">
                    BDT {item.current_prices}
                    <span className="text-gray-500 font-light ml-2 text-xs">
                      200 items in stock
                    </span>
                  </p>
                </td>
                <td align="right">
                    {
                        productData.some(pd=>pd.productId===item?.id)?<button type="button" onClick={()=>{
                            setProductData(productData.filter(pd => pd.productId !== item.id));
                            message.success('Product remove successfully...')
                        }} className="bg-[#cc2828] text-white text-[11px] font-bold w-[120px] py-[4px] rounded-full">Remove</button> :<button type="button" onClick={()=>{
                            const newProduct: ProductEntity = {
                             productId: item.id,
                             current_prices: item.current_prices,
                             productNameEn: item.product_title_en,
                             singleProductPrices: item.current_prices,
                             productQuantity: item.productQuantity || 1,
                             subTotal: (item.current_prices) * (item.productQuantity || 1),
                             isCancel: false
                           };
                           setProductData([...productData, newProduct]);
                           message.success('Product added successfully...')
                         }} className="bg-[#F48C13] text-white text-[11px] font-bold w-[120px] py-[4px] rounded-full">Add Product</button>
                    }
                    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AddProductVtwo;
