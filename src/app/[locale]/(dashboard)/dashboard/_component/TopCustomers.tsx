import CircleChar from '@/components/CircleChar';
import GbTable from '@/components/GbTable';
import { Card } from 'antd';
import React from 'react';

const TopCustomers = ({summaryData}:{summaryData:any}) => {
    return (
       <Card style={{ height: "100%" }} bordered={true}>
                <p className="text-[18px]  font-bold  leading-none">
                  Top Customers
                </p>
                <div className="mt-5">
                  <GbTable
                    dataSource={summaryData?.topCustomers}
                    columns={[
                      {
                        title: "Name",
                        dataIndex: "sl",
                        render: (text: string, record: any, i: any) => {
                          console.log(record,"record");
                          return <div className="flex items-center gap-2"><CircleChar text={record?.name?.slice(0,1)} />{record?.name}</div>;
                        },
                      },
                      {
                        title: "Phone",
                        dataIndex: "sl",
                        render: (text: string, record: any, i: any) => {
                          console.log(record,"record");
                          return <>{record?.phone} </>;
                        },
                      },
                      {
                        title: "Orders",
                        dataIndex: "sl",
                        render: (text: string, record: any, i: any) => {
                          return <span className="font-[500]">{record?.ordercount || 'N/A'}</span>;
                        },
                      },
                      {
                        title: "Total Value",
                        dataIndex: "sl",
                        align:"center",
                        render: (text: string, record: any, i: any) => {
                          return <span className="font-[500]">৳ {record?.price}</span>;
                        },
                      },
                      {
                        title: "Avg Orders",
                        dataIndex: "sl",
                        align:"end",
                        render: (text: string, record: any, i: any) => {
                          return <span className="font-[500]">{Math.ceil(Number(record?.price) / + Number(record?.ordercount))}</span>;
                        },
                      },
                    ]}
                  />
                </div>
              </Card>
    );
};

export default TopCustomers;