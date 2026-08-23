"use client";

import React from "react";
import { Table } from "antd";

type DTableProps = {
  loading?: boolean;
  columns: any;
  dataSource: any;
  pageSize?: number;
  totalPages?: number;
  showSizeChanger?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onTableChange?: (pagination: any, filter: any, sorter: any) => void;
  showPagination?: boolean;
  id?: string;
  rowSelection?: any;
  subscriber_table?: any;
  stickey?: boolean;
  scrollX?: any;
  scrollY?: any;
};

const GbTable = ({
  loading = false,
  columns,
  dataSource,
  pageSize,
  totalPages,
  showSizeChanger,
  onPaginationChange,
  onTableChange,
  showPagination,
  id,
  rowSelection,
  stickey,
  scrollX = "max-content",
  scrollY,
}: DTableProps) => {
  const paginationConfig = showPagination
    ? {
        pageSize,
        total: totalPages,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger,
        onChange: onPaginationChange,
      }
    : false;

  const sticky = stickey ? { offsetHeader: 0 } : false;

  return (
    <div className="w-full">
      <Table
        className="gb-table"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={paginationConfig}
        onChange={onTableChange}
        rowKey={id || "id"}
        rowSelection={rowSelection}
        sticky={sticky}
        scroll={{
          x: scrollX,
          y: scrollY,
        }}
      />
    </div>
  );
};

export default GbTable;