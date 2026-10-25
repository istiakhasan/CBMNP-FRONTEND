import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const SEARCH_PREFIX = {
  invoiceNumber: "invoice:",
  orderNumber: "order:",
};

const OrderSearch = ({ setSearchTerm, searchTerm }: any) => {
  const [searchBy, setSearchBy] = useState<"invoiceNumber" | "orderNumber">(
    String(searchTerm || "").startsWith(SEARCH_PREFIX.orderNumber)
      ? "orderNumber"
      : "invoiceNumber",
  );
  const inputValue = String(searchTerm || "")
    .replace(SEARCH_PREFIX.invoiceNumber, "")
    .replace(SEARCH_PREFIX.orderNumber, "");

  const handleSearch = (e:any) => {
    const value = e.target.value;
    setSearchTerm(value ? `${SEARCH_PREFIX[searchBy]}${value}` : "");

  };

  return (
    <div className="flex w-full sm:w-auto">
      <Select
        value={searchBy}
        onChange={(value) => {
          setSearchBy(value);
          setSearchTerm(inputValue ? `${SEARCH_PREFIX[value as keyof typeof SEARCH_PREFIX]}${inputValue}` : "");
        }}
        options={[
          { label: "Invoice", value: "invoiceNumber" },
          { label: "Order No.", value: "orderNumber" },
        ]}
        style={{ width: 120 }}
      />
      <Input
        placeholder={searchBy === "invoiceNumber" ? "Search by invoice number" : "Search by order number"}
        prefix={<SearchOutlined />}
        value={inputValue}
        onChange={handleSearch}
        allowClear
        style={{ width: 220 }}
      />
    </div>
  );
};

export default OrderSearch;
