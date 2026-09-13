"use client";

import React from "react";
import { Table } from "antd";
import { useAppTheme } from "@/context/ThemeContext";

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
  onRow?: any;
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
  onRow,
}: DTableProps) => {
  const { design } = useAppTheme();
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
  const tableScrollY = scrollY ?? (design.tableFullHeight ? "calc(100vh - 320px)" : undefined);
const hasExplicitWidths =
  Array.isArray(columns) &&
  columns.length > 0 &&
  columns.every((col: any) => col?.width !== undefined && col?.width !== null);

// user যা select করেছে সেটাই respect করো, শুধু fixed হলে width বাধ্যতামূলক
const tableLayout =
  design.tableLayout === "fixed" && !hasExplicitWidths
    ? "auto"          // fixed চাইলেও column width না থাকলে জোর করে auto (নাহলে header cut হবে)
    : design.tableLayout;

  return (
    <div className="gb-table-wrapper w-full" data-full-height={design.tableFullHeight}>
      <Table
        className="gb-table"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={paginationConfig}
        onChange={onTableChange}
        rowKey={id || "id"}
        rowSelection={rowSelection}
        onRow={onRow}
        sticky={sticky}
        bordered={design.tableBordered}
        tableLayout={tableLayout}
        scroll={{
          x: scrollX,
          y: tableScrollY,
        }}
      />
    </div>
  );
};

export default GbTable;
