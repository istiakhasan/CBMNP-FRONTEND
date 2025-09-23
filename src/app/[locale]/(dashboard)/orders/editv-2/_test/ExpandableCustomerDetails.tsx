import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, Phone, MapPin, Edit2, BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp, ExternalLink, Home, Building2 } from "lucide-react";
import AddressBook from "./AddressBook";

interface ExpandableCustomerDetailsProps {
  selectedCustomer: any | null;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  customerAddresses: any[];
  onAddressUpdate: (addresses: any[]) => void;
  onDeliveryAddressSelect: (address: any) => void;
  selectedDeliveryAddress?: any;
}

export default function ExpandableCustomerDetails({ 
  selectedCustomer, 
  isExpanded, 
  onToggleExpanded,
  customerAddresses,
  onAddressUpdate,
  onDeliveryAddressSelect,
  selectedDeliveryAddress
}: ExpandableCustomerDetailsProps) {
  const [showCourierDetails, setShowCourierDetails] = useState(false);
  const [addressBookExpanded, setAddressBookExpanded] = useState(false);

  if (!selectedCustomer) {
    return (
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
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
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="lg:sticky lg:top-4 space-y-4">
      <Card className="shadow-xl border-0 overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors">
              <CardTitle className="flex items-center justify-between text-gray-900">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Details
                  {selectedCustomer.isNew && (
                    <Badge className="bg-green-100 text-green-800 ml-2">NEW</Badge>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="p-6 space-y-6">
              {/* Customer Header with Basic Info */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedCustomer.name}</h3>
                    {selectedCustomer.nameBengali && (
                      <p className="text-gray-600 mb-1">{selectedCustomer.nameBengali}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Customer ID: {selectedCustomer?.customer_Id}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={selectedCustomer.type === 'Probashi' ? 'secondary' : 'outline'}>
                      {selectedCustomer.type}
                    </Badge>
                    {selectedCustomer.isNew && (
                      <Badge className="bg-green-100 text-green-800">NEW</Badge>
                    )}
                  </div>
                </div>
                
                {/* Quick Contact Info */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{selectedCustomer?.customerPhoneNumber}</span>
                  </div>
                  {selectedCustomer?.country && (
                    <div className="text-sm text-muted-foreground">
                      📍 {selectedCustomer?.country}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-100 h-7">
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* A. Order Statistics (Moved to top as requested) */}
              <Card className="shadow-md border border-purple-200">
                <CardHeader className="bg-purple-50 border-b border-purple-200">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <BarChart3 className="w-4 h-4" />
                    Order Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          {selectedCustomer.stats.delivered}
                        </span>
                      </div>
                      <p className="text-xs text-green-700">Delivered</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-lg font-semibold text-blue-600">
                          {selectedCustomer.stats.totalOrders}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700">Total Orders</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-lg font-semibold text-yellow-600">
                          {selectedCustomer.stats.flagged}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700">Flagged</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-lg font-semibold text-red-600">
                          {selectedCustomer.stats.cancelledOrders}
                        </span>
                      </div>
                      <p className="text-xs text-red-700">Cancelled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* B. Ongoing Orders Overview */}
              <Card className="shadow-md border border-green-200">
                <CardHeader className="bg-green-50 border-b border-green-200">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <BarChart3 className="w-4 h-4" />
                    Ongoing Orders 
                    <Badge className="bg-green-100 text-green-800">
                      {selectedCustomer.ongoingOrders.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {selectedCustomer.ongoingOrders.length > 0 ? (
                    selectedCustomer.ongoingOrders.map((order:any) => (
                      <div key={order.id} className="space-y-2 p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                          >
                            {order.id}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                          <Badge className={`${getStatusColor(order.status)} px-2 py-1 text-xs border`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-green-600">{formatPrice(order.amount)}</span>
                          <span className="text-muted-foreground">{order.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No ongoing orders</p>
                  )}
                </CardContent>
              </Card>

              {/* C. Delivery Success Rate Card */}
              <Card className="shadow-md border border-blue-200">
                <CardHeader className="bg-blue-50 border-b border-blue-200">
                  <CardTitle className="flex items-center justify-between text-blue-800">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Delivery Success Rate
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowCourierDetails(!showCourierDetails)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-100"
                    >
                      Details {showCourierDetails ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40" cy="40" r="32"
                          fill="none" stroke="#e5e7eb" strokeWidth="8"
                        />
                        <circle
                          cx="40" cy="40" r="32"
                          fill="none" stroke="#3b82f6" strokeWidth="8"
                          strokeDasharray={`${selectedCustomer.deliveryStats.successRate * 2.01} 201`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {selectedCustomer.deliveryStats.successRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <Collapsible open={showCourierDetails} onOpenChange={setShowCourierDetails}>
                    <CollapsibleContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Courier</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">Success %</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCustomer.deliveryStats.couriers.map((courier:any) => (
                            <TableRow key={courier.name}>
                              <TableCell className="font-medium">{courier.name}</TableCell>
                              <TableCell className="text-center">{courier.total}</TableCell>
                              <TableCell className="text-center">
                                <Badge 
                                  variant={courier.confidence >= 90 ? "default" : courier.confidence >= 80 ? "secondary" : "destructive"}
                                >
                                  {courier.confidence}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <p className="text-xs text-muted-foreground text-center">
                        Last updated at {selectedCustomer.deliveryStats.lastUpdated} by {selectedCustomer.deliveryStats.updatedBy}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>

              {/* Address Book with Delivery Address Selection */}
              <AddressBook
                customer={selectedCustomer}
                addresses={customerAddresses}
                onAddressUpdate={onAddressUpdate}
                isExpanded={addressBookExpanded}
                onToggleExpanded={() => setAddressBookExpanded(!addressBookExpanded)}
              />

              {/* Delivery Address Reference (Read-only) */}
              {selectedDeliveryAddress && (
                <Card className="shadow-md border border-orange-200">
                  <CardHeader className="bg-orange-50 border-b border-orange-200">
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <MapPin className="w-4 h-4" />
                      Current Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        {getAddressIcon(selectedDeliveryAddress.type)}
                        <div className="flex-1">
                          <p className="font-medium text-green-800">{selectedDeliveryAddress.label}</p>
                          <p className="text-sm text-green-700">{selectedDeliveryAddress.address}</p>
                          {selectedDeliveryAddress.district && (
                            <p className="text-xs text-green-600">
                              📍 {selectedDeliveryAddress.district}
                              {selectedDeliveryAddress.district === 'Dhaka' ? ' - ৳70 shipping' : ' - ৳120 shipping'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Manage delivery address in the main order flow
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <div className="lg:hidden h-4"></div>
    </div>
  );
}