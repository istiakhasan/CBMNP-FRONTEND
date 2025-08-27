import React, { useState } from "react";
import { Button, Spin, message } from "antd";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { instance } from "@/helpers/axios/axiosInstance";

const DownloadOrders = ({ filters }: any) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `${getBaseUrl()}/orders/download-reports`,
        {
          params: { ...filters },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders-report.xlsx");
      document.body.appendChild(link);
      link.click();

      message.success("Excel downloaded successfully!");
    } catch (error: any) {
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          console.error(json);
          message.error(json.message || "Download failed");
          return;
        } catch (parseErr) {
          console.error("Failed to parse error blob:", parseErr);
        }
      }
      message.error("Failed to download Excel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleDownload} disabled={loading}>
        {loading ? <Spin size="small" /> : "Download Orders Excel"}
      </Button>
    </div>
  );
};

export default DownloadOrders;
