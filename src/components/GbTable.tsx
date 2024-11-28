"use client";
import React from "react";
import { Table, Skeleton } from "antd";

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
  subscriber_table
}: DTableProps) => {
  const paginationConfig = showPagination
    ? {
        pageSize: pageSize,
        total: totalPages,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger: showSizeChanger,
        onChange: onPaginationChange,
      }
    : false;

  return (
    <div>
      {loading ? (
        <>
          <Skeleton
            rootClassName="abc"
            active
            title={false}
            paragraph={{ rows: 11, width: "100%" }}
            // style={{ margin: 0 }}
          />
        </>
      ) : (
        <Table
          // className={`custom_table ${subscriber_table}`}
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={paginationConfig}
          onChange={onTableChange}
          rowKey={"id"}
          rowSelection={rowSelection}
        />
      )}
    </div>
  );
};

export default GbTable;
