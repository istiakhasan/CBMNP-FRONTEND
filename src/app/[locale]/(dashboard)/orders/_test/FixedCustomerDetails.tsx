import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { User, Phone, MapPin, Edit2, BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp, ExternalLink, Home, Building2, Eye } from "lucide-react";
import StatusTextBadge from "@/util/StatusTextBadge";

interface FixedCustomerDetailsProps {
  selectedCustomer: any | null;
  selectedDeliveryAddress?: any;
  selectedCustomerOrdersCount?: any;
}

export default function FixedCustomerDetails({ 
  selectedCustomer, 
  selectedDeliveryAddress,
  selectedCustomerOrdersCount
}: FixedCustomerDetailsProps) {
  const [showOngoingOrders, setShowOngoingOrders] = useState(false);
  const [showDeliveryStats, setShowDeliveryStats] = useState(false);

  if (!selectedCustomer) {
    return (
      <div className="lg:sticky lg:top-4">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className=" from-gray-50 to-gray-100 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              No Customer Selected
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="py-8">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-muted-foreground">Search and select a customer to view details</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bd-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return ' text-green-800 border-green-200';
      case 'Pending': return ' text-yellow-800 border-yellow-200';
      case 'Processing': return ' text-blue-800 border-blue-200';
      case 'Shipped': return ' text-purple-800 border-purple-200';
      default: return ' text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-3 h-3" />;
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'Processing': return <AlertCircle className="w-3 h-3" />;
      case 'Shipped': return <TrendingUp className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Office': return <Building2 className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };
  console.log(selectedCustomer,"check");
  return (
    <div className="lg:sticky lg:top-4 shadow-lg h-[90vh] overflow-scroll custom_scroll">
      <Card className=" border-0 overflow-hidden">
        <CardHeader className=" from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2 ">
            <User className="w-5 h-5 " />
            Customer Details
            {selectedCustomer?.isNew && (
              <Badge className=" text-green-800 ml-2">NEW</Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Customer Header with Basic Info */}
          <div className="p-4 from-gray-50 to-blue-50 rounded-lg border space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedCustomer?.customerName}</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedCustomer?.customer_Id}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant={selectedCustomer?.customerType === 'PROBASHI' ? 'secondary' : 'outline'}>
                  {selectedCustomer?.customerType}
                </Badge>
                {selectedCustomer?.isNew && (
                  <Badge className=" text-green-800">NEW</Badge>
                )}
              </div>
            </div>
            
            {/* Quick Contact Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                <div className="flex items-center gap-1 mb-1">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedCustomer?.customerPhoneNumber}</span>
              </div>
              {selectedCustomer?.country && (
                <div className="text-sm text-muted-foreground">
                📍 {selectedCustomer?.country}
                </div>
              )}
              </div>
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-200  h-7">
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="p-4  rounded-lg border ">
            <h4 className="text-sm font-medium  mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Order Statistics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2  rounded border ">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-3 h-3 " />
                  <span className="text-sm font-semibold ">
                    {selectedCustomerOrdersCount?.find((item:any)=>item?.label==='Delivered')?.count || 0}
                  </span>
                </div>
                <p className="text-xs ">Delivered</p>
              </div>
              <div className="text-center p-2  rounded border ">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BarChart3 className="w-3 h-3 " />
                  <span className="text-sm font-semibold ">
                    {selectedCustomerOrdersCount?.find((item:any)=>item?.label==='Total')?.count || 0}
                  </span>
                </div>
                <p className="text-xs ">Total</p>
              </div>
              <div className="text-center p-2  rounded border ">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertCircle className="w-3 h-3 " />
                  <span className="text-sm font-semibold ">
                    {selectedCustomerOrdersCount?.find((item:any)=>item?.label==='Returned')?.count || 0}
                  </span>
                </div>
                <p className="text-xs ">Return</p>
              </div>
              <div className="text-center p-2  rounded border ">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="w-3 h-3 " />
                  <span className="text-sm font-semibold ">
                    {selectedCustomerOrdersCount?.find((item:any)=>item?.label==='Cancel')?.count || 0}
                  </span>
                </div>
                <p className="text-xs ">Cancelled</p>
              </div>
            </div>
          </div>

          {/* Ongoing Orders */}
          <div className="p-4  rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-green-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Ongoing Orders
                <Badge variant="secondary" className=" text-green-800 text-xs">
                  {selectedCustomer?.ongoingOrders}
                </Badge>
              </h4>
              {selectedCustomer?.ongoingOrders > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowOngoingOrders(!showOngoingOrders)}
                  className="text-green-600  h-6 px-2"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {showOngoingOrders ? 'Hide' : 'View'}
                </Button>
              )}
            </div>
            
            {selectedCustomer?.ongoingOrders === 0 ? (
              <p className="text-xs text-green-600">No ongoing orders</p>
            ) : (
              <Collapsible open={showOngoingOrders} onOpenChange={setShowOngoingOrders}>
                <CollapsibleContent className="space-y-2">
                  {selectedCustomer?.orders?.map((order:any) => (
                    <div key={order.id} className="p-2  rounded border text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-600">{order?.id}</span>
                        <StatusTextBadge status={{label:order?.status?.label}} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-medium">{formatPrice(order.totalPrice)}</span>
                        <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>

          {/* Delivery Success Rate */}
          <div className="p-4  rounded-lg border ">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium  flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Success Rate
              </h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDeliveryStats(!showDeliveryStats)}
                className="  h-6 px-2"
              >
                <Eye className="w-3 h-3 mr-1" />
                {showDeliveryStats ? 'Hide' : 'View'}
              </Button>
            </div>
            
            <div className="flex items-center justify-center mb-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32" cy="32" r="24"
                    fill="none" stroke="#4F8A6D" strokeWidth="6"
                  />
                  <circle
                    cx="32" cy="32" r="24"
                    fill="none" stroke="#4F8A6D" strokeWidth="6"
                    strokeDasharray={`${selectedCustomer?.deliveryStats?.successRate * 1.51} 151`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold ">
                    {selectedCustomer?.deliveryStats?.successRate}%
                  </span>
                </div>
              </div>
            </div>

            <Collapsible open={showDeliveryStats} onOpenChange={setShowDeliveryStats}>
              <CollapsibleContent className="space-y-2">
                {selectedCustomer?.deliveryStats?.couriers.slice(0, 3).map((courier:any) => (
                  <div key={courier.name} className="flex justify-between items-center text-xs">
                    <span className="font-medium">{courier.name}</span>
                    <Badge 
                      variant={courier.confidence >= 90 ? "default" : courier.confidence >= 80 ? "secondary" : "destructive"}
                      className="text-xs px-1 py-0"
                    >
                      {courier.confidence}%
                    </Badge>
                  </div>
                ))}
                <p className="text-xs  text-center">
                  Updated by {selectedCustomer?.deliveryStats?.updatedBy}
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Current Delivery Address */}
          {selectedDeliveryAddress && (
            <div className="p-4  rounded-lg border ">
              <h4 className="text-sm font-medium  mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h4>
              <div className="flex items-start gap-2">
                {getAddressIcon(selectedDeliveryAddress?.type || 'Home')}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium ">{selectedDeliveryAddress?.label}</span>
                    <Badge variant="outline" className="text-xs">{selectedDeliveryAddress?.type}</Badge>
                  </div>
                  <p className="text-xs  mb-1">{selectedDeliveryAddress?.address}</p>
                  {selectedDeliveryAddress.district && (
                    <p className="text-xs text-green-600">
                      📍 {selectedDeliveryAddress?.district}
                      {selectedDeliveryAddress?.district === 'Dhaka' ? ' - ৳70' : ' - ৳120'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}