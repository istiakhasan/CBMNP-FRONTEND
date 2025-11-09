"use client";
import { getUserInfo, isLoggedIn } from "@/service/authService";
import {
  Layout,
  Menu,
  Row,
  Space,
  Spin,
  Avatar,
  Dropdown,
  Typography,
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  ApartmentOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authKey } from "@/constants/storageKey";


const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const SuperAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const uerInfo:any=getUserInfo()
  useEffect(() => {
    const userLoggedIn = isLoggedIn();
    if (!userLoggedIn) {
      router.push(`/${locale}/login`);
    }else if(uerInfo?.role !== 'super_admin'){
     localStorage.removeItem(authKey)
     router.push(`/${locale}/login`);
    } else {
      setLoading(false);
    }
  }, [router, locale]);

  if (loading) {
    return (
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Space>
          <Spin size="small" spinning={loading}></Spin>
        </Space>
      </Row>
    );
  }

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      onClick: () => router.push(`/${locale}/super-admin/dashboard`),
    },
    {
      key: "organizations",
      icon: <ApartmentOutlined />,
      label: "Organizations",
      onClick: () => router.push(`/${locale}/super-admin/organization`),
    },
    // {
    //   key: "users",
    //   icon: <TeamOutlined />,
    //   label: "Manage Users",
    //   onClick: () => router.push(`/${locale}/super-admin/users`),
    // },
    // {
    //   key: "settings",
    //   icon: <SettingOutlined />,
    //   label: "Settings",
    //   onClick: () => router.push(`/${locale}/super-admin/settings`),
    // },
  ];

  const profileMenu = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => router.push(`/${locale}/super-admin/profile`),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem(authKey);
        router.push(`/${locale}/super-login`);
      },
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: "#001529",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            color: "#fff",
            textAlign: "center",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {collapsed ? "SA" : "Super Admin"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname.split("/").pop() || "dashboard"]}
          items={menuItems}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Space>
            {/* Sidebar toggle */}
            {collapsed ? (
              <MenuUnfoldOutlined
                onClick={() => setCollapsed(false)}
                style={{ fontSize: 18, cursor: "pointer" }}
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => setCollapsed(true)}
                style={{ fontSize: 18, cursor: "pointer" }}
              />
            )}

            <Text strong style={{ fontSize: 16 }}>
              Super Admin Panel
            </Text>
          </Space>

          {/* Profile Avatar */}
          <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
            <Avatar
              size="large"
              style={{ backgroundColor: "#87d068", cursor: "pointer" }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            margin: "16px",
            padding: "16px",
            background: "#fff",
            overflowY: "auto",
            borderRadius: "8px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SuperAdminLayout;
