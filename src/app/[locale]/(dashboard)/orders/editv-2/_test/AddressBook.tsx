import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { MapPin, Plus, Edit2, Trash2, Home, Building2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { toast } from "react-toastify";


export interface Address {
  id: string;
  label: string;
  type: "Home" | "Office" | "Other";
  isDefault: boolean;
  district?: string;
  division?: string;
  thana?: string;
  address: string;
  mapLocation?: string;
  receiverName?: string;
  receiverPhone?: string;
  notes?: string;
}

interface AddressBookProps {
  customer: any | null;
  addresses: Address[];
  onAddressUpdate: (addresses: Address[]) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const districts = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh",
  "Brahmanbaria", "Comilla", "Feni", "Lakshmipur", "Noakhali", "Tangail", "Kishoreganj"
];

const divisions = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"
];

const addressTypes = [
  { value: "Home", label: "Home", icon: Home },
  { value: "Office", label: "Office", icon: Building2 },
  { value: "Other", label: "Other", icon: MapPin }
];

export default function AddressBook({ customer, addresses, onAddressUpdate, isExpanded, onToggleExpanded }: AddressBookProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    type: "Home" as "Home" | "Office" | "Other",
    district: "",
    division: "",
    thana: "",
    address: "",
    mapLocation: "",
    receiverName: "",
    receiverPhone: "",
    notes: ""
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      label: "",
      type: "Home",
      district: "",
      division: "",
      thana: "",
      address: "",
      mapLocation: "",
      receiverName: "",
      receiverPhone: "",
      notes: ""
    });
  };

  const openAddDialog = () => {
    resetForm();
    setEditingAddress(null);
    setShowAddDialog(true);
  };

  const openEditDialog = (address: Address) => {
    setFormData({
      label: address.label,
      type: address.type,
      district: address.district || "",
      division: address.division || "",
      thana: address.thana || "",
      address: address.address,
      mapLocation: address.mapLocation || "",
      receiverName: address.receiverName || "",
      receiverPhone: address.receiverPhone || "",
      notes: address.notes || ""
    });
    setEditingAddress(address);
    setShowAddDialog(true);
  };

  const handleSaveAddress = () => {
    if (!formData.label || !formData.address) {
      toast.error("Missing required fields");
      return;
    }

    const newAddress: Address = {
      id: editingAddress?.id || `addr-${Date.now()}`,
      label: formData.label,
      type: formData.type,
      isDefault: addresses.length === 0, // First address is default
      district: formData.district,
      division: formData.division,
      thana: formData.thana,
      address: formData.address,
      mapLocation: formData.mapLocation,
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      notes: formData.notes
    };

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? { ...newAddress, isDefault: addr.isDefault } : addr
      );
      toast.success("Address updated successfully");
    } else {
      updatedAddresses = [...addresses, newAddress];
      toast.success("Address added successfully");
    }

    onAddressUpdate(updatedAddresses);
    setShowAddDialog(false);
    resetForm();
    setEditingAddress(null);
  };

  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find(addr => addr.id === addressId);
    if (addressToDelete?.isDefault && addresses.length > 1) {
      // If deleting default address, make the first remaining address default
      const updatedAddresses = addresses
        .filter(addr => addr.id !== addressId)
        .map((addr, index) => ({ ...addr, isDefault: index === 0 }));
      onAddressUpdate(updatedAddresses);
    } else {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      onAddressUpdate(updatedAddresses);
    }

    toast.success("Address deleted successfully");
  };

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    onAddressUpdate(updatedAddresses);

    toast.success("Default address updated");
  };

  const getAddressIcon = (type: string) => {
    const addressType = addressTypes.find(t => t.value === type);
    const Icon = addressType?.icon || MapPin;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <Card className="shadow-md border border-indigo-200">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-indigo-50 border-b border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-colors">
            <CardTitle className="flex items-center justify-between text-indigo-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address Book
                {addresses.length > 0 && (
                  <Badge className="bg-indigo-100 text-indigo-800">
                    {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
                  </Badge>
                )}
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-4 space-y-4">
            {/* Add Address Button */}
            <Button
              onClick={openAddDialog}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>

            {/* Address List */}
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No addresses saved</p>
                <p className="text-xs">Add addresses for quick delivery options</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 border rounded-lg transition-all ${
                      address.isDefault 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getAddressIcon(address.type)}
                        <h4 className="font-medium text-gray-900">{address.label}</h4>
                        <Badge variant="outline" className="text-xs">
                          {address.type}
                        </Badge>
                        {address.isDefault && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(address)}
                          className="h-7 w-7 p-0 text-gray-500 hover:text-blue-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="h-7 w-7 p-0 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{address.address}</p>
                      {address.district && (
                        <p>{address.thana && `${address.thana}, `}{address.district}</p>
                      )}
                      {address.receiverName && (
                        <p>Receiver: {address.receiverName}</p>
                      )}
                      {address.notes && (
                        <p className="text-xs text-muted-foreground italic">{address.notes}</p>
                      )}
                    </div>

                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        className="mt-2 text-xs h-7"
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      {/* Add/Edit Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update the address details" : "Add a new address to the address book"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Address Label and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Address Label *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => updateField("label", e.target.value)}
                  placeholder="e.g., Home, Office, Parents House"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Address Type</Label>
                <Select value={formData.type} onValueChange={(value:any) => updateField("type", value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {addressTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Information */}
            {customer?.type === "Non-Probashi" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Select value={formData.division} onValueChange={(value:any) => updateField("division", value)}>
                    <SelectTrigger className="h-10">
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
                  <Select value={formData.district} onValueChange={(value:any) => updateField("district", value)}>
                    <SelectTrigger className="h-10">
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
            )}

            {customer?.type === "Non-Probashi" && (
              <div className="space-y-2">
                <Label htmlFor="thana">Thana/Upazila</Label>
                <Input
                  id="thana"
                  value={formData.thana}
                  onChange={(e) => updateField("thana", e.target.value)}
                  placeholder="Enter thana/upazila"
                  className="h-10"
                />
              </div>
            )}

            {/* Full Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter complete address with landmarks"
                rows={3}
              />
            </div>

            {/* Receiver Information for Probashi */}
            {customer?.type === "Probashi" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Receiver Name</Label>
                  <Input
                    id="receiverName"
                    value={formData.receiverName}
                    onChange={(e) => updateField("receiverName", e.target.value)}
                    placeholder="Local receiver name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverPhone">Receiver Phone</Label>
                  <Input
                    id="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={(e) => updateField("receiverPhone", e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="h-10"
                  />
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="mapLocation">Map Location / GPS</Label>
              <Input
                id="mapLocation"
                value={formData.mapLocation}
                onChange={(e) => updateField("mapLocation", e.target.value)}
                placeholder="GPS coordinates or map reference"
                className="h-10"
              />
            </div>             

            <div className="space-y-2">
              <Label htmlFor="notes">Delivery Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Special delivery instructions or notes"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} className="bg-indigo-600 hover:bg-indigo-700">
              {editingAddress ? "Update Address" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}