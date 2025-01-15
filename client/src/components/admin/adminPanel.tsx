import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Button,
  Card,
  List,
  Collapse,
  message,
  Popconfirm,
  Tag,
  Select,
  Input,
  Form,
  Modal,
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
  const [isSelfRoleRemoved, setIsSelfRoleRemoved] = useState(false);
  const { store } = useContext(Context);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const getUsers = useCallback(async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      message.error(t('adminPanel.errorFetchingUsers'));
    }
  }, [t]);

  const handleSaveSalesforce = useCallback(
    async (user: IUser, values: { Phone?: number }) => {
      setIsLoading(true);
      try {
        if (!values.Phone) {
          throw new Error(t('profile.salesforcePhoneError'));
        }
        const phoneString = values.Phone.toString();
        if (phoneString.length < 10 || phoneString.length > 15) {
          throw new Error(t('profile.salesforcePhoneInvalid'));
        }
        store.setUserData(user.username, values.Phone);
        await store.sendToSalesforce();

        message.success(
          t('profile.salesforceSuccessMessage', { name: user.username }),
        );
        setIsModalVisible(false);
      } catch (error) {
        message.error((error as Error).message || t('profile.salesforceError'));
      } finally {
        setIsLoading(false);
      }
    },
    [store, t],
  );
  console.log(selectedUser);
  const blockUser = useCallback(
    async (userId: number) => {
      setIsLoading(true);
      try {
        await UserService.toggleBlockUser(userId.toString());
        if (store.user.id === userId) {
          message.warning(t('adminPanel.selfBlockMessage'));
          setTimeout(() => {
            window.location.href = '/login';
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
        message.error(t('adminPanel.errorBlockMessage'));
      } finally {
        setIsLoading(false);
      }
    },
    [store.user.id, t],
  );

  const unblockUser = useCallback(
    async (userId: number) => {
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
        message.error(t('adminPanel.errorUnblockMessage'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const deleteUser = useCallback(
    async (userId: number) => {
      setIsLoading(true);
      try {
        await UserService.deleteUser(Number(userId));
        message.success(t('adminPanel.successDeleteMessage', { id: userId }));
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        message.error(t('adminPanel.errorDeleteMessage'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const changeRole = useCallback(
    async (userId: number, newRole: string) => {
      setIsLoading(true);
      try {
        await UserService.changeRole(userId, newRole);
        message.success(
          t('adminPanel.successRoleChangeMessage', { id: userId }),
        );

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
        message.error(t('adminPanel.errorRoleChangeMessage'));
      } finally {
        setIsLoading(false);
      }
    },
    [store.user.id, t],
  );

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleRoleChange = (userId: number) => (value: string) => {
    changeRole(userId, value);
  };

  const handleBlockConfirm = (userId: number) => () => {
    blockUser(userId);
  };

  const handleUnblockConfirm = (userId: number) => () => {
    unblockUser(userId);
  };

  const handleDeleteConfirm = (userId: number) => () => {
    deleteUser(userId);
  };

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
                        onConfirm={handleUnblockConfirm(user.id)}
                      >
                        <Button type="link">
                          {t('adminPanel.unblockButton')}
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title={t('adminPanel.blockConfirmationTitle')}
                        onConfirm={handleBlockConfirm(user.id)}
                      >
                        <Button type="link">
                          {t('adminPanel.blockButton')}
                        </Button>
                      </Popconfirm>
                    )}
                    <Select
                      defaultValue={user.role}
                      onChange={handleRoleChange(user.id)}
                      style={{ marginLeft: '10px' }}
                    >
                      <Select.Option value="user">User</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                    </Select>
                    <Popconfirm
                      title={t('adminPanel.deleteConfirmationTitle')}
                      onConfirm={handleDeleteConfirm(user.id)}
                    >
                      <Button type="link" danger>
                        {t('adminPanel.deleteButton')}
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalVisible(true);
                      }}
                    >
                      {t('profile.createSalesforceButton')}
                    </Button>
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
      <Modal
        title={t('profile.salesforceModalTitle')}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          onFinish={(values) => {
            if (selectedUser) handleSaveSalesforce(selectedUser, values);
          }}
        >
          <Form.Item label={t('profile.salesforceName')} name="Name">
            {selectedUser?.username}
          </Form.Item>
          <Form.Item
            label={t('profile.salesforcePhone')}
            name="Phone"
            rules={[
              { required: true, message: t('profile.salesforcePhoneError') },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" className="me-2">
              {t('profile.createButton')}
            </Button>
            <Button htmlType="button" onClick={handleModalCancel}>
              {t('profile.cancelButton')}
            </Button>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminPanel;
