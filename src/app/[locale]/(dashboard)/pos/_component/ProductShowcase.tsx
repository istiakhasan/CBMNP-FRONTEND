/* eslint-disable @next/next/no-img-element */
"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { useEffect, useState } from "react";
import ProductOrderList from "./Abc";

const ProductShowcase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useGetAllProductQuery({
    searchTerm: debouncedSearchTerm,
    limit: "200",
    active: true,
  });


  const handleAddToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };


  const handleQuantityChange = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === productId
            ? { ...p, quantity: Math.max(1, p.quantity + delta) }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  if (isLoading) return null;

  return (
    <div className="bg-[#E6EAED] min-h-[100vh]">
      <GbHeader />
      <div className=" p-[16px] grid grid-cols-12 gap-4">
        <div className="col-span-8 ">
          <div className=" mb-2">
            <h1 className="text-xl mb-0 font-bold text-gray-800">
              Welcome, Wesley Adrian
            </h1>
            <p className="text-gray-600">December 24, 2024</p>
          </div>

          {/* Search Area */}
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.data?.map((product: any) => {
              const cartItem = cart.find((p) => p.id === product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="p-4 flex justify-center bg-gray-100">
                    <img
                      src={product?.images?.[0]?.url}
                      alt={product.name}
                      className="h-[160px] w-[160px] object-fill"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-xs font-semibold text-primary bg-blue-100 px-2 py-1 rounded mr-2">
                      {product?.category?.label}
                    </span> 
                    (<span>{product?.inventories?.stock || 0}</span>)
                    <h3 className="mt-2 text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      ৳{product.salePrice?.toLocaleString()}
                    </p>

                    {/* Quantity + Add to Cart */}
                    <div className="mt-4 flex items-center justify-between">
                      {cartItem ? (
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{cartItem.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-1 bg-primary text-white   transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Cart Summary */}
        <div className=" bg-white p-4 rounded shadow col-span-4">
          <ProductOrderList
            setCart={setCart}
            cart={cart}
            handleQuantityChange={handleQuantityChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
