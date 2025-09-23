import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Search,
  Package,
  ShoppingCart,
  Plus,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { useGetAllProductQuery } from "@/redux/api/productApi";

interface ProductSearchPanelProps {
  onAddToCart: (product: any, quantity: number) => void;
}

export default function ProductSearchPanel({
  onAddToCart,
}: ProductSearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>(
    {}
  );
  const { data: mockProducts, isLoading } = useGetAllProductQuery({
    searchTerm: searchTerm,
    limit: "200",
    active: true,
  });

  const updateQuantity = (productId: string, change: number) => {
    const currentQuantity = quantities[productId] || 1;
    const newQuantity = Math.max(1, currentQuantity + change);
    const product = mockProducts?.data?.find((p: any) => p.id === productId);
    if (product && newQuantity <= product?.inventories?.stock) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));
    }
  };

  const setQuantity = (productId: string, quantity: number) => {
    const product = mockProducts?.data?.find((p: any) => p.id === productId);
    if (product && quantity >= 1 && quantity <= product?.inventories?.stock) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    }
  };

  const addToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    onAddToCart(product, quantity);
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bd-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = (available: number) => {
    if (Number(available || 0) < 1)
      return {
        variant: "destructive" as const,
        text: "Out of Stock",
        color: "border-red-200",
      };
    if (available < 5)
      return {
        variant: "destructive" as const,
        text: `${available} left`,
        color: "border-yellow-200",
      };
    if (available < 10)
      return {
        variant: "default" as const,
        text: `${available} available`,
        color: "border-orange-200",
      };
    return {
      variant: "secondary" as const,
      text: `${available} available`,
      color: "border-green-200",
    };
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Package className="w-5 h-5 text-green-600" />
          Product Search & Add to Cart
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 shadow-sm border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Product Grid */}
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {mockProducts?.data
            ?.slice() // create a shallow copy to avoid mutating original data
            .sort(
              (a: any, b: any) =>
                (b?.inventories?.stock || 0) - (a?.inventories?.stock || 0)
            ) // descending by stock
            .map((product: any) => {
              const quantity = quantities[product.id] || 1;
              const isOutOfStock =
                Number(product?.inventories?.stock || 0) === 0;
              const isQuantityExceeded = quantity > product?.inventories?.stock;
              const stockStatus = getStockStatus(product?.inventories?.stock);
              const isLowStock = product?.inventories?.stock < 5;

              return (
                <div
                  key={product.id}
                  className={`p-4 border-2 rounded-xl space-y-4 transition-all duration-300 hover:shadow-lg ${
                    stockStatus.color
                  } ${
                    isOutOfStock
                      ? "opacity-50 bg-gray-50"
                      : "bg-white hover:bg-gradient-to-br hover:from-white hover:to-green-50 hover:border-green-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {product?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        ID: {product?.internalId}
                      </p>
                      <p className="font-semibold text-green-600 mt-1">
                        {formatPrice(product?.salePrice)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={stockStatus.variant}
                        className="font-medium"
                      >
                        {stockStatus.text}
                      </Badge>
                      {isLowStock && !isOutOfStock && (
                        <div
                          className="flex items-center gap-1 text-amber-600"
                          title="Low stock warning!"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs font-medium">Low Stock</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isOutOfStock && (
                    <div className="space-y-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Qty:
                        </span>
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product?.id, -1)}
                            disabled={quantity <= 1}
                            className="h-9 w-9 p-0 rounded-none hover:bg-gray-100 border-r border-gray-200"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={product?.inventories?.stock}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(
                                product.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 h-9 text-center border-0 rounded-none focus:ring-0 font-medium"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product?.id, 1)}
                            disabled={quantity >= product?.inventories?.stock}
                            className="h-9 w-9 p-0 rounded-none hover:bg-gray-100 border-l border-gray-200"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {quantity > 1 && (
                          <span className="text-sm font-medium text-green-600">
                            = {formatPrice(product?.salePrice * quantity)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={isQuantityExceeded}
                        className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 hover:scale-105 shadow-md"
                        title={
                          isQuantityExceeded
                            ? `Quantity exceeds available stock (${product?.available} available)`
                            : undefined
                        }
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>

                      {isQuantityExceeded && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Quantity exceeds available stock</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isOutOfStock && (
                    <Badge
                      variant="destructive"
                      className="w-full justify-center py-2 font-medium"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
              );
            })}
        </div>

        {mockProducts?.data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No products found matching your search.</p>
            <p className="text-sm">Try adjusting your search terms.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
