import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { MapPin, Plus, Home, Building2, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";


const districts = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh",
  "Brahmanbaria", "Comilla", "Feni", "Lakshmipur", "Noakhali", "Tangail", "Kishoreganj"
];

const divisions = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"
];

interface AddressSelectionPanelProps {
  customer: any;
  addresses: any[];
  onAddressUpdate: (addresses: any[]) => void;
  selectedDeliveryAddress?: any;
  onDeliveryAddressSelect: (address: any) => void;
}

export default function AddressSelectionPanel({ 
  customer, 
  addresses, 
  onAddressUpdate, 
  selectedDeliveryAddress,
  onDeliveryAddressSelect 
}: AddressSelectionPanelProps) {
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    type: "Home" as "Home" | "Office" | "Other",
    district: "",
    division: "",
    thana: "",
    address: "",
    receiverName: "",
    receiverPhone: "",
    notes: ""
  });

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Office': return <Building2 className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getShippingCost = (district?: string) => {
    if (district === 'Dhaka') return 70;
    if (['Rajshahi', 'Barishal', 'Khulna', 'Sylhet', 'Chittagong', 'Rangpur', 'Mymensingh'].includes(district || '')) return 120;
    return 70;
  };

  const generateAddressId = () => {
    return "ADDR-" + Math.floor(Math.random() * 900000 + 100000);
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      toast.error("Please fill in required fields");
      return;
    }

    const address: any = {
      id: generateAddressId(),
      label: newAddress.label,
      type: newAddress.type,
      isDefault: addresses.length === 0, // First address becomes default
      district: newAddress.district,
      division: newAddress.division,
      thana: newAddress.thana,
      address: newAddress.address,
      receiverName: newAddress.receiverName || customer.name,
      receiverPhone: newAddress.receiverPhone || customer.phone,
      notes: newAddress.notes,
      mapLocation: `${newAddress.thana}, ${newAddress.district}`
    };

    const updatedAddresses = [...addresses, address];
    onAddressUpdate(updatedAddresses);
    
    // Auto-select the new address if it's the first one or if no address is currently selected
    if (!selectedDeliveryAddress || addresses.length === 0) {
      onDeliveryAddressSelect(address);
    }

    toast.success("Address added successfully!");

    // Reset form
    setNewAddress({
      label: "",
      type: "Home",
      district: "",
      division: "",
      thana: "",
      address: "",
      receiverName: "",
      receiverPhone: "",
      notes: ""
    });

    setShowAddAddressDialog(false);
  };

  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find(addr => addr.id === addressId);
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    onAddressUpdate(updatedAddresses);

    // If the deleted address was selected, clear selection
    if (selectedDeliveryAddress?.id === addressId) {
      if (updatedAddresses.length > 0) {
        onDeliveryAddressSelect(updatedAddresses[0]);
      }
    }

    toast.info("Address removed");
  };

  // Auto-generate addresses from customer location if none exist
  const generateDefaultAddress = () => {
    if (customer.location.address || customer.location.receiverAddress) {
      const defaultAddress: any = {
        id: generateAddressId(),
        label: customer.type === 'Probashi' ? "Receiver Address" : "Main Address",
        type: "Home",
        isDefault: true,
        district: customer.location.district,
        division: customer.location.division,
        thana: customer.location.thana,
        address: customer.location.address || customer.location.receiverAddress || "",
        receiverName: customer.location.receiverName || customer.name,
        receiverPhone: customer.location.receiverPhone || customer.phone,
        mapLocation: customer.location.mapLocation
      };

      onAddressUpdate([defaultAddress]);
      onDeliveryAddressSelect(defaultAddress);

      toast.success("Default address created");
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Delivery Address Selection
            <Badge className="bg-orange-100 text-orange-800">
              {customer.name}
            </Badge>
          </div>
          <Button 
            onClick={() => setShowAddAddressDialog(true)}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Address
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-gray-900">No addresses found</h3>
            <p className="text-muted-foreground mb-4">
              Add delivery addresses for {customer.name} to continue with the order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={generateDefaultAddress}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Use Customer Info
              </Button>
              <Button 
                onClick={() => setShowAddAddressDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Address Selection Dropdown */}
            <div className="space-y-2">
              <Label>Select Delivery Address *</Label>
              <Select 
                value={selectedDeliveryAddress?.id || ""} 
                onValueChange={(addressId:any) => {
                  const address = addresses.find(addr => addr.id === addressId);
                  if (address) {
                    onDeliveryAddressSelect(address);
                  }
                }}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose delivery address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id}>
                      <div className="flex items-center gap-3 py-1">
                        {getAddressIcon(address.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{address.label}</span>
                            <Badge variant="outline" className="text-xs">
                              {address.type}
                            </Badge>
                            {address.isDefault && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Default</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-64">
                            {address.address}
                          </div>
                          {address.district && (
                            <div className="text-xs text-green-600">
                              📍 {address.district} - ৳{getShippingCost(address.district)} shipping
                            </div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Address Display */}
            {selectedDeliveryAddress && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getAddressIcon(selectedDeliveryAddress.type)}
                        <span className="font-medium text-green-800">
                          {selectedDeliveryAddress.label}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {selectedDeliveryAddress.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700 mb-1">
                        {selectedDeliveryAddress.address}
                      </p>
                      {selectedDeliveryAddress.receiverName && (
                        <p className="text-xs text-green-600">
                          📞 {selectedDeliveryAddress.receiverName} - {selectedDeliveryAddress.receiverPhone}
                        </p>
                      )}
                      {selectedDeliveryAddress.district && (
                        <p className="text-xs text-green-600 mt-1">
                          📍 {selectedDeliveryAddress.district} - ৳{getShippingCost(selectedDeliveryAddress.district)} shipping cost
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAddress(selectedDeliveryAddress.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Available Addresses List */}
            {addresses.length > 1 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Available Addresses ({addresses.length})
                </Label>
                <div className="grid gap-2">
                  {addresses.filter(addr => addr.id !== selectedDeliveryAddress?.id).map((address) => (
                    <div key={address.id} className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {getAddressIcon(address.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{address.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {address.type}
                              </Badge>
                              {address.isDefault && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">Default</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {address.address}
                            </p>
                            {address.district && (
                              <p className="text-xs text-green-600 mt-1">
                                📍 {address.district} - ৳{getShippingCost(address.district)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeliveryAddressSelect(address)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                          >
                            Select
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Address Dialog */}
        <Dialog open={showAddAddressDialog} onOpenChange={setShowAddAddressDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Add New Delivery Address
              </DialogTitle>
              <DialogDescription>
                Add a new delivery address for {customer.name}. All required fields are marked with *.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressLabel">Address Label *</Label>
                  <Input
                    id="addressLabel"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Home, Office, Shop"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressType">Address Type</Label>
                  <Select 
                    value={newAddress.type} 
                    onValueChange={(value: "Home" | "Office" | "Other") => 
                      setNewAddress(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Select 
                    value={newAddress.division} 
                    onValueChange={(value:any) => setNewAddress(prev => ({ ...prev, division: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((division) => (
                        <SelectItem key={division} value={division}>
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select 
                    value={newAddress.district} 
                    onValueChange={(value:any) => setNewAddress(prev => ({ ...prev, district: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thana">Thana/Upazila</Label>
                <Input
                  id="thana"
                  value={newAddress.thana}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, thana: e.target.value }))}
                  placeholder="Enter thana/upazila"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <Textarea
                  id="fullAddress"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address with landmarks"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Receiver Name</Label>
                  <Input
                    id="receiverName"
                    value={newAddress.receiverName}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, receiverName: e.target.value }))}
                    placeholder={customer.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverPhone">Receiver Phone</Label>
                  <Input
                    id="receiverPhone"
                    value={newAddress.receiverPhone}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, receiverPhone: e.target.value }))}
                    placeholder={customer.phone}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input
                  id="notes"
                  value={newAddress.notes}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Delivery instructions, landmarks, etc."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAddressDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddAddress}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Address
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}