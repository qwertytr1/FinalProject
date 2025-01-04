import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Card,
  List,
  Collapse,
  message,
  Popconfirm,
  Tag,
  Select,
} from 'antd';
import { useTranslation } from 'react-i18next';
import UserService from '../../services/userService';
import { type IUser } from '../../models/iUser';
import Context from '../..';

const { Panel } = Collapse;

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelfRoleRemoved, setIsSelfRoleRemoved] = useState(false); // Состояние для отслеживания снятия роли с себя
  const { store } = useContext(Context);

  const handleBlockUser = async (userId: number) => {
    setIsLoading(true);
    try {
      await UserService.toggleBlockUser(userId.toString());
      if (store.user.id === userId) {
        message.warning(t('adminPanel.selfBlockMessage'));
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login
        }, 2000);
        return;
      }
      message.success(t('adminPanel.successBlockMessage', { id: userId }));
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked: true } : user,
        ),
      );
    } catch (error) {
      console.error('Error blocking user:', error);
      message.error(t('adminPanel.errorBlockMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    setIsLoading(true);
    try {
      await UserService.toggleUnblockUSer(userId.toString());
      message.success(t('adminPanel.successUnblockMessage', { id: userId }));
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked: false } : user,
        ),
      );
    } catch (error) {
      console.error('Error unblocking user:', error);
      message.error(t('adminPanel.errorUnblockMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setIsLoading(true);
    try {
      await UserService.deleteUser(Number(userId));
      message.success(t('adminPanel.successDeleteMessage', { id: userId }));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error(t('adminPanel.errorDeleteMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (userId: number, newRole: string) => {
    setIsLoading(true);
    try {
      await UserService.changeRole(userId, newRole);
      message.success(t('adminPanel.successRoleChangeMessage', { id: userId }));

      if (newRole !== 'admin' && store.user.id === userId) {
        message.success(t('adminPanel.adminRoleRemoved'));
        setIsSelfRoleRemoved(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );
    } catch (error) {
      console.error('Error changing role:', error);
      message.error(t('adminPanel.errorRoleChangeMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  useEffect(() => {
    getUsers();
  }, [store]);

  return (
    <Card title={t('adminPanel.title')} className="mt-4">
      <Collapse defaultActiveKey={['1']}>
        <Panel header={t('adminPanel.userListPanelHeader')} key="1">
          <Button
            type="primary"
            onClick={getUsers}
            className="mb-3"
            loading={isLoading}
          >
            {t('adminPanel.refreshUserListButton')}
          </Button>
          {users.length > 0 ? (
            <List
              bordered
              dataSource={users}
              renderItem={(user) => (
                <List.Item key={user.id}>
                  <strong>{user.username}</strong> - {user.email}
                  <span style={{ marginLeft: '10px' }}>
                    <Tag color={user.role === 'admin' ? 'gold' : 'blue'}>
                      {user.role}
                    </Tag>
                  </span>
                  <div style={{ marginLeft: 'auto' }}>
                    {user.isBlocked ? (
                      <Popconfirm
                        title={t('adminPanel.unblockConfirmationTitle')}
                        onConfirm={() => handleUnblockUser(user.id)}
                      >
                        <Button type="link">
                          {t('adminPanel.unblockButton')}
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title={t('adminPanel.blockConfirmationTitle')}
                        onConfirm={() => handleBlockUser(user.id)}
                      >
                        <Button type="link">
                          {t('adminPanel.blockButton')}
                        </Button>
                      </Popconfirm>
                    )}
                    <Select
                      defaultValue={user.role}
                      onChange={(value) => handleChangeRole(user.id, value)}
                      style={{ marginLeft: '10px' }}
                    >
                      <Select.Option value="user">User</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                    </Select>
                    <Popconfirm
                      title={t('adminPanel.deleteConfirmationTitle')}
                      onConfirm={() => handleDeleteUser(user.id)}
                    >
                      <Button type="link" danger>
                        {t('adminPanel.deleteButton')}
                      </Button>
                    </Popconfirm>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div>{t('adminPanel.noUsersMessage')}</div>
          )}
        </Panel>
      </Collapse>
      {isSelfRoleRemoved && <div>{t('adminPanel.roleChangeSuccess')}</div>}
    </Card>
  );
};

export default AdminPanel;
