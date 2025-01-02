import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, List, Collapse, message, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import UserService from '../../services/userService';
import { type IUser } from '../../models/iUser';
import Context from '../..';

const { Panel } = Collapse;

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { store } = useContext(Context);

  const handleBlockUser = async (userId: number) => {
    setIsLoading(true);
    try {
      await UserService.toggleBlockUser(userId.toString());
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
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div>{t('adminPanel.noUsersMessage')}</div>
          )}
        </Panel>
      </Collapse>
    </Card>
  );
};

export default AdminPanel;
