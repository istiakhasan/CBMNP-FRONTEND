"use client";
import { SearchOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useGetAllProductBySearchQuery } from "@/redux/api/productApi";
import { useEffect, useState, FC } from "react";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { Image } from "antd";
import { toast } from "react-toastify";

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

const AddProduct: FC<AddProductProps> = ({ setIsModalOpen, productData, setProductData, orderId }) => {
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

  const handleQuantityChange = (index: number, delta: number) => {
    const updatedData = [...loadData];
    const product = { ...updatedData[index] };

    if (product.productQuantity) {
      const newQuantity = product.productQuantity + delta;
      if (newQuantity < 1) {
        return toast.error("Quantity should not be empty");
      }
      product.productQuantity = newQuantity;
    } else if (delta > 0) {
      product.productQuantity = delta;
    } else {
      return toast.error("Quantity should not be empty");
    }

    updatedData[index] = product;

    const updatedProductData = [...productData];
    const existingProductIndex = updatedProductData.findIndex(pd => pd.productId === product.id);

    if (existingProductIndex > -1) {
      updatedProductData[existingProductIndex] = {
        ...updatedProductData[existingProductIndex],
        productQuantity: product.productQuantity,
        subTotal: product.productQuantity * product.current_prices,
      };
    } else {
      updatedProductData.push({
        productId: product.id,
        current_prices: product.current_prices,
        productNameEn: product.product_title_en,
        singleProductPrices: product.current_prices,
        productQuantity: product.productQuantity,
        subTotal: product.productQuantity * product.current_prices,
        orderId,
        isCancel: false,
      });
    }

    setLoadData(updatedData);
    setProductData(updatedProductData);
  };

  return (
    <div>
      <div className="sdw_box mb-3">
        <h1 className="box_title mb-5">Product Info</h1>
        <div className="flex items-center gap-1.5 bg-gray-100 p-3 rounded-md">
          <SearchOutlined className="text-lg text-gray-400" />
          <input
            className="flex-grow bg-gray-100 border-none outline-none text-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
        </div>
      </div>

      <div className="max-h-100 overflow-auto custom_scroll">
        <table className="product_info_table w-full">
          <tbody>
            {loadData.map((item, i) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!productData.some(pd => pd.productId === item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newProduct: ProductEntity = {
                          productId: item.id,
                          current_prices: item.current_prices,
                          productNameEn: item.product_title_en,
                          singleProductPrices: item.current_prices,
                          productQuantity: item.productQuantity || 1,
                          subTotal: (item.current_prices) * (item.productQuantity || 1),
                          orderId,
                          isCancel: false
                        };
                        setProductData([...productData, newProduct]);
                      } else {
                        setProductData(productData.filter(pd => pd.productId !== item.id));
                      }
                    }}
                  />
                </td>
                <td>
                  <Image
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
                <td>
                  <div className="flex justify-between w-50 bg-gray-100 p-3 rounded-full">
                    <PlusOutlined onClick={() => handleQuantityChange(i, 1)} />
                    {/* <span>{(productData.find(pd=>pd.productId===item?.id)?.productQuantity )|| 1}</span> */}
                    <span>{item.productQuantity || 0}</span>
                    <MinusOutlined onClick={() => handleQuantityChange(i, -1)} />
                  </div>
                </td>
                {/* <td>
                  <i className="ri-delete-bin-line text-lg"></i>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 justify-end mt-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-orange-600 font-medium text-sm py-1 border border-orange-600 px-3 rounded-md"
        >
          Close
        </button>
        {/* <button onClick={() => setIsModalOpen(false)} className="cm_button py-1">
          Save
        </button> */}
      </div>
    </div>
  );
};

export default AddProduct;
