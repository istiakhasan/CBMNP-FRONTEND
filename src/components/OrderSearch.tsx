import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const OrderSearch = ({ setSearchTerm,searchTerm }:any) => {
  const handleSearch = (e:any) => {
    const value = e.target.value;
    setSearchTerm(value)

  };

  return (
    <Input
      placeholder="Search by Order ID, Customer Name, Phone Number"
      prefix={<SearchOutlined />}
      value={searchTerm}
      onChange={handleSearch}
      allowClear
      style={{ width: 300 }}
    />
  );
};

export default OrderSearch;
