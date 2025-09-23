import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Check,
  AlertCircle,
  X,
  Package,
} from "lucide-react";

interface OrderSummaryProps {
  cartItems: any[];
  orderDetails: any;
  onUpdateCartItem: (productId: string, quantity: number) => void;
  onConfirmOrder: () => void;
  onClearCart?: () => void;
  getTotalAmount: () => number;
}

export default function OrderSummaryEdit({
  cartItems,
  orderDetails,
  onUpdateCartItem,
  onConfirmOrder,
  onClearCart,
  getTotalAmount,
}: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bd-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalAmount();
  const shipping = orderDetails.shippingCharge;
  const total = subtotal + shipping;
  const updateQuantity = (productId: string, change: number) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      onUpdateCartItem(productId, Math.max(0, newQuantity));
    }
  };

  const removeItem = (productId: string) => {
    onUpdateCartItem(productId, 0);
  };

  const handleClearCart = () => {
    if (onClearCart) {
      onClearCart();
    } else {
      cartItems.forEach((item) => {
        onUpdateCartItem(item.product.id, 0);
      });
    }
  };

  const canConfirmOrder =
    orderDetails.currier &&
    cartItems.length > 0  &&
    !!orderDetails.deliveryAddress &&
    orderDetails?.orderSource?.length > 0
  const missingRequirements = [];

  if (cartItems.length === 0) missingRequirements.push("Add products to cart");
  if (!orderDetails.deliveryAddress)
    missingRequirements.push("Select Delivery address(s)");
  if (!orderDetails.orderSource)
    missingRequirements.push("Select Order source");
  if (!orderDetails.currier) missingRequirements.push("Select courier");
  console.log(cartItems,"abcd");
  return (
    <div className="lg:sticky lg:top-4 space-y-4">
      <Card className=" border-0 overflow-hidden">
        <CardHeader className=" border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900 whitespace-nowrap">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              Order Summary
              {cartItems.length > 0 && (
                <Badge variant="secondary" className=" ml-2">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </Badge>
              )}
            </CardTitle>
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600">
                Your cart is empty
              </p>
              <p className="text-sm">
                Add products to get started with your order
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {cartItems.map((item) => {
                const isAtMaxStock =
                  item.quantity >= item?.product?.inventories?.stock;
                const isLowStock = item?.product?.inventories?.stock < 5;
                return (
                  <div
                    key={item.product.id}
                    className="space-y-3 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-indigo-200 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {item.product.name}
                        </h4>
                        {/* <p className="text-xs text-muted-foreground">ID: {item.product.id}</p> */}
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          {formatPrice(item?.product?.salePrice)}
                        </p>
                        {!!isLowStock && (
                          <div className="flex items-center gap-1 mt-2 p-1 bg-amber-50 rounded text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-xs">
                              Low stock: {item?.product?.inventories?.stock}{" "}
                              left
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="px-3 text-sm font-semibold min-w-[3ch] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={isAtMaxStock}
                          className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.product.salePrice * item.quantity)}
                        </span>
                        {isAtMaxStock && (
                          <p className="text-xs text-amber-600">
                            Max stock reached
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Order Details Summary */}
          {cartItems.length > 0 && (
            <>
              <Separator className="bg-gray-200" />
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600" />
                  Order Configuration
                </h4> 
                <div className="space-y-2 text-sm">
                  {orderDetails?.warehouse?.label && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Warehouse:</span>
                      <Badge variant="outline" className="text-xs font-medium">
                        {orderDetails?.warehouse?.label}
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Type:</span>
                    <Badge variant="outline" className="text-xs font-medium">
                      {orderDetails?.orderType}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping:</span>
                    <Badge variant="outline" className="text-xs font-medium">
                      {orderDetails?.shippingType}
                    </Badge>
                  </div>
                  {orderDetails?.paymentMethod?.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Payment:</span>
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {orderDetails?.paymentMethods?.map((method: any) => (
                          <Badge
                            key={method}
                            variant="outline"
                            className="text-xs"
                          >
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

               {cartItems.length > 0 && (
            <>
              <Separator className="bg-gray-200" />
              <div className="space-y-3  p-4 rounded-lg border ">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-900">{subtotal} ৳</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="text-gray-900">
                    {shipping > 0 ? shipping : "Free"} ৳
                  </span>
                </div>
                   <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-gray-900">
                    {total} ৳
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Paid:</span>
                  <span className="text-gray-900">
                    {orderDetails?.amount > 0 ? orderDetails?.amount : 0} ৳
                  </span>
                </div>
             
                <Separator className="bg-gray-200" />
                <div className="flex justify-between font-semibold text-[12px]">
                  <span className="text-gray-900">Total Receivable:</span>
                  <span className="">{Number(total || 0) - Number(orderDetails?.amount || 0)} ৳</span>
                </div>
              </div>
            </>
          )}

          {/* Validation Alert */}
          {cartItems.length > 0 && !canConfirmOrder && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="space-y-2">
                  <p className="font-medium">
                    Please complete the following to place your order:
                  </p>
                  <ul className="text-sm space-y-1">
                    {missingRequirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons - Sticky on Mobile */}
      <div className="lg:sticky lg:bg-white fixed bottom-0 left-0 right-0 lg:bottom-0 lg:right-auto bg-white lg:bg-transparent p-4 lg:p-0 border-t lg:border-t-0 border-gray-200 lg:border-none shadow-lg lg:shadow-none z-50">
        <div className="max-w-7xl mx-auto lg:max-w-none">
          <div className="space-y-3">
            <Button
              onClick={onConfirmOrder}
              disabled={!canConfirmOrder}
              className="w-full h-12  bg-primary text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Update Order {cartItems.length > 0 && `• ${formatPrice(total)}`}
            </Button>

            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-medium"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for mobile sticky button */}
      <div className="lg:hidden h-24"></div>
    </div>
  );
}
