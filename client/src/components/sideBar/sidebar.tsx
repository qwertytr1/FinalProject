import React, { useState } from 'react';
import { Layout, Menu, Typography, Card } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import ProfilePage from '../profile/profile';
import AdminPanel from '../admin/admin';
import './sideBar.css';

const { Sider, Content, Header } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

const SidebarMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('profile');

  const toggleSidebar = () => setCollapsed(!collapsed);

  const renderContent = () => {
    switch (selectedMenu) {
      case 'profile':
        return (
          <Card bordered={false} className="content-card">
            <ProfilePage />
          </Card>
        );
      case 'admin-panel':
        return (
          <Card bordered={false} className="content-card">
            <AdminPanel />
          </Card>
        );
      case 'statistics':
        return (
          <Card bordered={false} className="content-card">
            <Title level={3}>Статистика</Title>
            <p>Здесь будет информация о статистике.</p>
          </Card>
        );
      default:
        return (
          <Card bordered={false} className="content-card">
            <Title level={3}>Добро пожаловать!</Title>
            <p>Выберите пункт меню для начала работы.</p>
          </Card>
        );
    }
  };

  return (
    <Layout className="layout-container">
      {/* Sidebar */}
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleSidebar}
          className="layout-sider"
        >
          <div className="layout-logo">

          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['profile']}
            onClick={(e) => setSelectedMenu(e.key)}
          >
            <Menu.Item key="profile" icon={<UserOutlined />}>
              Профиль
            </Menu.Item>
            <SubMenu key="admin" icon={<TeamOutlined />} title="Администрация">
              <Menu.Item key="admin-panel">Пользователи</Menu.Item>
              <Menu.Item key="statistics" icon={<BarChartOutlined />}>
                Статистика
                          </Menu.Item>
                          <Menu.Item key="templates" icon={<BarChartOutlined />}>
                Шаблоны
                          </Menu.Item>
                          <Menu.Item key="tags" icon={<BarChartOutlined />}>
                Тэги
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        {/* Content */}
        <Content className="layout-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default SidebarMenu;