import React, { useContext, useState } from 'react';
import { Layout, Menu, Card } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  BookOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Context from '../..';
import './sideBar.css';
import LanguageSelector from '../../localisation/languageSelector';
import SearchTemplates from '../search/search';

const { Sider, Content } = Layout;

const SidebarMenu: React.FC = () => {
  const { store } = useContext(Context);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Layout className="layout-container">
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
          selectedKeys={[window.location.pathname]}
          onClick={(e) => navigate(e.key)}
        >
          <Menu.Item key="/main" icon={<UserOutlined />}>
            {t('sidebarMenu.main')}
          </Menu.Item>
          <Menu.Item key="/templates/all" icon={<BookOutlined />}>
            {t('sidebarMenu.allTemplates')}
          </Menu.Item>
          {!store.isAuth ? (
            <Menu.Item key="/login" icon={<LoginOutlined />}>
              {t('sidebarMenu.login')}
            </Menu.Item>
          ) : (
            <>
              <Menu.Item key="/templates" icon={<BookOutlined />}>
                {t('sidebarMenu.templates')}
              </Menu.Item>
              <Menu.Item key="/profile" icon={<UserOutlined />}>
                {t('sidebarMenu.profile')}
              </Menu.Item>
              <Menu.Item key="/user-forms" icon={<BookOutlined />}>
                {t('sidebarMenu.userForms')}
              </Menu.Item>
              {store.user.role === 'admin' && (
                <Menu.SubMenu
                  key="admin"
                  icon={<TeamOutlined />}
                  title={t('sidebarMenu.admin')}
                >
                  <Menu.Item key="/admin">
                    {t('sidebarMenu.adminPanel')}
                  </Menu.Item>
                  <Menu.Item key="/statistics" icon={<BarChartOutlined />}>
                    {t('sidebarMenu.statistics')}
                  </Menu.Item>
                  <Menu.Item key="/templates/admin" icon={<BarChartOutlined />}>
                    {t('sidebarMenu.templates')}
                  </Menu.Item>
                  <Menu.Item key="/admin-forms" icon={<BarChartOutlined />}>
                    {t('sidebarMenu.adminForms')}
                  </Menu.Item>
                  <Menu.Item key="/addTags" icon={<BarChartOutlined />}>
                    {t('sidebarMenu.tags')}
                  </Menu.Item>
                </Menu.SubMenu>
              )}
            </>
          )}
        </Menu>
        <div className="language-selector">
          <LanguageSelector />
        </div>
      </Sider>
      <Layout>
        <Content className="layout-content">
          <Card bordered={false} className="content-card">
            <SearchTemplates />
          </Card>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarMenu;
