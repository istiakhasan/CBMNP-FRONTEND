/* eslint-disable @next/next/no-img-element */
import { BarChartOutlined, PictureOutlined } from "@ant-design/icons";
import { Card, Empty, Tag } from "antd";

const formatMoney = (amount: unknown) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Number(amount) || 0);

const TopProducts = ({ items, isLoading }: { items?: any[]; isLoading?: boolean }) => {
  if (isLoading) return <Card style={{ height: "100%" }} loading />;

  return (
    <Card
      className="h-full !border-slate-200 shadow-sm"
      bodyStyle={{ padding: 0 }}
      title={<div className="flex items-center gap-2 text-base font-semibold text-slate-800"><BarChartOutlined className="text-primary" />Top selling products</div>}
      extra={<Tag color="blue" className="!mr-0">Top {items?.length || 0}</Tag>}
    >
      {!items?.length ? (
        <Empty className="py-10" description="No product sales in this period" />
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((item: any, index: number) => (
            <div key={item?.productId || index} className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${index < 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                {index + 1}
              </span>
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {item?.imageUrl ? (
                  <img src={item.imageUrl} alt={item?.productName || "Product"} className="h-full w-full object-cover" />
                ) : (
                  <PictureOutlined className="absolute inset-0 m-auto text-lg text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{item?.productName || "Unnamed product"}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">SKU: <span className="font-medium text-slate-600">{item?.sku || "Not set"}</span></p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-emerald-700">৳ {formatMoney(item?.totalSales)}</p>
                <p className="mt-0.5 text-xs text-slate-500">{Number(item?.quantitySold || 0).toLocaleString()} sold</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TopProducts;
