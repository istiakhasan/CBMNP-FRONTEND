import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const OrderSearch = ({ setSearchTerm, searchTerm }: any) => {
  return (
    <div className="w-full sm:w-auto">
      <Input
        placeholder="Search invoice, order, phone or name"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        allowClear
        style={{ width: 220 }}
      />
    </div>
  );
};

export default OrderSearch;
