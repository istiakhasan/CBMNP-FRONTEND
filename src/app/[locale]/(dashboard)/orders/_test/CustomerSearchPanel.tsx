"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, User, UserPlus, AlertCircle } from "lucide-react";
import CustomerRegistrationForm from "./CustomerRegistrationForm";
import { useGetAllCustomersQuery, useLazyGetCustomerByIdQuery } from "@/redux/api/customerApi";
import { getBaseUrl } from "@/helpers/config/envConfig";
import axios from "axios";

interface Customer {
  id: number;
  customerName: string;
  customerPhoneNumber: string;
  customerAdditionalPhoneNumber?: string | null;
  address?: string | null;
  division?: string | null;
  district?: string | null;
  thana?: string | null;
  customerType: "PROBASHI" | "NON_PROBASHI";
  country?: string | null;
  customer_Id: string;
}

interface CustomerSearchPanelProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
  setSelectedCustomerOrderCount: any;
  setOrderDetails: any;
  setCustomerAddresses?: any;
  onDeliveryAddressSelect?: any;
}

export default function CustomerSearchPanel({
  selectedCustomer,
  onCustomerSelect,
  setSelectedCustomerOrderCount,
  setOrderDetails,
  setCustomerAddresses,
  onDeliveryAddressSelect
}: CustomerSearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [lazyLoadCustomer]=useLazyGetCustomerByIdQuery()
  // Fetch customers from API
  const { data: response, isLoading } = useGetAllCustomersQuery(
    { searchTerm, limit: 50 },
    { refetchOnMountOrArgChange: true }
  );

  // Update allCustomers when API data changes
  useEffect(() => {
    if (response?.data) {
      setAllCustomers(response.data);
    }
  }, [response]);

  // Handle search input
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      const results = allCustomers.filter(
        (customer) =>
          customer.customerName.toLowerCase().includes(term.toLowerCase()) ||
          customer.customerPhoneNumber.includes(term) ||
          customer.customer_Id.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Select a customer
  const selectCustomer = (customer: any) => {
    setCustomerAddresses(customer?.addresses);
    onCustomerSelect(customer);
    setSearchTerm("");
    setShowResults(false);
  };

  // Handle new customer registration
  const handleRegisterCustomer = (newCustomer: any) => {
    setAllCustomers((prev) => [newCustomer, ...prev]);
    onCustomerSelect(newCustomer);
    onCustomerSelect(newCustomer);
    setCustomerAddresses(newCustomer?.addresses);
    setShowRegistrationForm(false);
    onDeliveryAddressSelect(newCustomer?.addresses[0]);
    setOrderDetails((prev: any) => {
      return {
        ...prev,
        deliveryAddress: newCustomer?.addresses?.find(
          (ab: any) => ab.isDefault
        ),
      };
    });
  };

  const openRegistrationForm = () => {
    setShowRegistrationForm(true);
    setShowResults(false);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r  border-b">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <User className="w-5 h-5 " />
          Customer Search & Registration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Search Input */}
        <div className="space-y-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or customer ID..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-12 shadow-sm border-gray-200 "
            />

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 max-h-64 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((customer: any) => (
                    <div
                      key={customer.id}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={async () => {
                        const res = await axios.get(
                          `${getBaseUrl()}/customers/orders-count/${
                            customer?.customer_Id
                          }`
                        );
                        const lasyLoad= await lazyLoadCustomer({id:customer?.customer_Id}).unwrap()
                        selectCustomer(lasyLoad?.data);
                        setSelectedCustomerOrderCount(res?.data?.data);
                        setCustomerAddresses(customer?.addresses);
                        setOrderDetails((prev: any) => {
                          return {
                            ...prev,
                            deliveryAddress: customer?.addresses?.find(
                              (ab: any) => ab.isDefault
                            ),
                          };
                        });
                        onDeliveryAddressSelect(customer?.addresses?.find(
                              (ab: any) => ab.isDefault
                            ));
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.customerName}
                          </p>
                          {customer.address && (
                            <p className="text-sm text-gray-600">
                              {customer.address}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {customer.customerPhoneNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {customer.customer_Id}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              customer.customerType === "PROBASHI"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {customer.customerType.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">Customer not found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      No customer found with {searchTerm}
                    </p>
                    <Button
                      onClick={openRegistrationForm}
                      className=" text-white"
                      size="sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register New Customer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Register New Customer Button */}
          <Button
            onClick={openRegistrationForm}
            variant="outline"
            className="w-full    "
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register New Customer
          </Button>
        </div>

        {/* Selected Customer Status */}
        {selectedCustomer && (
          <div className="p-3  border  rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2  rounded-full"></div>
                <span className="text-sm ">
                  Customer Selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm ">
                  {selectedCustomer.customerName}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Customer Registration Form */}
      <CustomerRegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onRegister={handleRegisterCustomer}
        selectedCustomer={selectedCustomer}
        setCustomerAddresses={setCustomerAddresses}
      />
    </Card>
  );
}
