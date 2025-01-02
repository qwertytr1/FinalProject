import React, { useState } from 'react';
import { Layout, Menu, Typography, Card } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ProfilePage from '../profile/profile';
import AdminPanel from '../admin/admin';
import './sideBar.css';
import CreateTemplateModal from '../template/addTemplate/addTemplateParts/addtemplate';
import TemplatesPage from '../template/templatesView/templatePage';
import AddTagPage from '../tags/addTagPage';
import LanguageSelector from '../../localisation/languageSelector';
import Main from '../home/main';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

const SidebarMenu: React.FC = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('profile');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'main':
        return (
          <Card bordered={false} className="content-card">
            <Main />
          </Card>
        );
      case 'templates':
        return (
          <Card bordered={false} className="content-card">
            <TemplatesPage />
          </Card>
        );
      case 'addTemplate':
        return (
          <Card bordered={false} className="content-card">
            <CreateTemplateModal />
          </Card>
        );
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
      case 'tags':
        return (
          <Card bordered={false} className="content-card">
            <AddTagPage />
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
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleSidebar}
          className="layout-sider"
        >
          <div className="layout-logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['profile']}
            onClick={(e) => {
              setSelectedMenu(e.key);
            }}
          >
            <Menu.Item key="main" icon={<UserOutlined />}>
              {t('sidebarMenu.main')}
            </Menu.Item>
            <Menu.Item key="addTemplate" icon={<UserOutlined />}>
              {t('sidebarMenu.addTemplate')}
            </Menu.Item>
            <Menu.Item key="templates" icon={<BookOutlined />}>
              {t('sidebarMenu.templates')}
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              {t('sidebarMenu.profile')}
            </Menu.Item>
            <SubMenu
              key="admin"
              icon={<TeamOutlined />}
              title={t('sidebarMenu.admin')}
            >
              <Menu.Item key="admin-panel">
                {t('sidebarMenu.adminPanel')}
              </Menu.Item>
              <Menu.Item key="statistics" icon={<BarChartOutlined />}>
                {t('sidebarMenu.statistics')}
              </Menu.Item>
              <Menu.Item key="admin-templates" icon={<BarChartOutlined />}>
                {t('sidebarMenu.templates')}
              </Menu.Item>
              <Menu.Item key="tags" icon={<BarChartOutlined />}>
                {t('sidebarMenu.tags')}
              </Menu.Item>
            </SubMenu>
          </Menu>
          <div className="language-selector">
            <LanguageSelector />
          </div>
        </Sider>
        <Content className="layout-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default SidebarMenu;
