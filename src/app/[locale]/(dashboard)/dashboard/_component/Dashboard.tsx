"use client"
import React from 'react';
import GbHeader from '@/components/ui/dashboard/GbHeader';
import { Card, Col, Row, Segmented, Statistic } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { getUserInfo } from '@/service/authService';
import { useGetUserByIdQuery } from '@/redux/api/usersApi';
import { useGetProfileInfoQuery } from '@/redux/api/authApi';
const PortFolioOverview = dynamic(() => import('./PortFolioOverview'), {
  ssr: false 
});
const Dashboard = () => {
  const t = useTranslations('Dashboard');
  const userInfo:any=getUserInfo()
  const {data,isLoading}=useGetProfileInfoQuery({
    id:userInfo?.userId
  })
  if(isLoading){
    return 
  }
  return (
    <div className='h-screen overflow-auto'>
      <GbHeader title='Dashboard' />
      <div className='p-[16px]'>
        <div className='flex items-start gap-2'>
          <i className="ri-layout-grid-fill text-[20px]"></i>
          <div className=''>
            <p className='text-[26px]  font-bold  leading-none'>{t('title')}</p>
            <p className='text-[16px] text-gray-500  my-0 py-0'>{t('bio')}{data?.data?.name}!</p>
          </div>
        </div>
        <div>
          <div className='my-4'>
            {/* <Segmented<string>
              style={{ background: "#E2E6EF" }}
              options={['Overview', 'Reports', 'Notification', 'Calendar']}
              onChange={(value) => {
              }}
            /> */}
          </div>
          <Row gutter={16} className='pb-4'>
            <Col className='mb-5' span={6}>
              <Card >
                <div>
                  <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>
                  <i className="ri-money-dollar-circle-line text-[18px]"></i> Assets Under Management
                  </div>
                  <Statistic
                    value={45231890}
                    valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <ArrowUpOutlined style={{ color: '#3f8600', marginRight: 4 }} />
                    <span style={{ color: '#3f8600', fontSize: 14, marginRight: 4 }}>
                      +20.1%
                    </span>
                    <span style={{ fontSize: 14, color: '#8c8c8c' }}>from last month</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col className='mb-5' span={6}>
              <Card >
                <div>
                  <div style={{  marginBottom: 8,fontSize: 14, color: '#8c8c8c'}}>
                  <i className="ri-group-line text-[18px]"></i> Total Clients
                  </div>
                  <Statistic
                    value={45231890}
                    valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <ArrowUpOutlined style={{ color: '#3f8600', marginRight: 4 }} />
                    <span style={{ color: '#3f8600', fontSize: 14, marginRight: 4 }}>
                      +20.1%
                    </span>
                    <span style={{ fontSize: 14, color: '#8c8c8c' }}>from last month</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col className='mb-5' span={6}>
              <Card >
                <div>
                  <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>
                  <i className="ri-line-chart-line text-[18px]"></i> Portfolio Performance
                  </div>
                  <Statistic
                    value={45231890}
                    valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <ArrowUpOutlined style={{ color: '#3f8600', marginRight: 4 }} />
                    <span style={{ color: '#3f8600', fontSize: 14, marginRight: 4 }}>
                      +20.1%
                    </span>
                    <span style={{ fontSize: 14, color: '#8c8c8c' }}>from last month</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col className='mb-5' span={6}>
              <Card>
                <div>
                  <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>
                  <i className="ri-guide-line text-[18px]"></i> Active Trades
                  </div>
                  <Statistic
                    value={45231890}
                    valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <ArrowUpOutlined style={{ color: '#3f8600', marginRight: 4 }} />
                    <span style={{ color: '#3f8600', fontSize: 14, marginRight: 4 }}>
                      +20.1%
                    </span>
                    <span style={{ fontSize: 14, color: '#8c8c8c' }}>from last month</span>
                  </div>
                </div>
              </Card>
            </Col>
      
            <Col span={13}>
              <Card bordered={true}>
                <PortFolioOverview />
              </Card>
            </Col>
            <Col  span={11}>
              <Card  style={{padding:"0"}} className='h-[100%] overflow-auto p-0 db_card' bordered={true}>
               
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )

};

export default Dashboard;