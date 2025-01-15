import { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Descriptions,
  message,
  Modal,
  Select,
  Pagination,
  List,
  Spin,
} from 'antd';
import { useTranslation } from 'react-i18next';
import Context from '../..';
import $api from '../../http';

const { Title } = Typography;
const { Option } = Select;

interface JiraTicket {
  key: string;
  fields: {
    summary: string;
  };
}

const ProfilePage = observer(() => {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const initialValues = {
    username: store.user.username || '',
    email: store.user.email || '',
    language: store.user.language || '',
    theme: store.user.theme || '',
    password: '',
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    form.setFieldsValue(initialValues);
  };

  const handleCancelChanges = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSalesforce = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSaveSalesforce = async (values: { Phone?: number }) => {
    if (!values.Phone) {
      message.error(t('profile.salesforcePhoneError'));
      return;
    }
    const phoneString = values.Phone.toString();
    if (phoneString.length < 10 || phoneString.length > 15) {
      message.error(t('profile.salesforcePhoneInvalid'));
      return;
    }
    store.setUserData(store.user.username, values.Phone);
    await store.sendToSalesforce();
    setIsModalVisible(false);
  };

  const handleSaveChanges = async (values: typeof initialValues) => {
    try {
      await store.saveEditUsers(values);
      message.success(t('profile.saveSuccess'));
      setIsEditing(false);
    } catch (error) {
      message.error(t('profile.saveError'));
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await $api.get('/tickets', {
          params: {
            status: statusFilter,
            page: currentPage,
            limit: 10,
          },
        });

        setTickets(response.data.issues);
        setTotalTickets(response.data.total);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        message.error(t('profile.errorFetchingTickets'));
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentPage, statusFilter, t]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // сбрасываем на первую страницу при изменении фильтра
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-5">
      <Card
        bordered={false}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Title level={3} className="text-center">
          {t('profile.pageTitle')}
        </Title>
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSaveChanges}
          >
            <Form.Item
              label={t('profile.usernameLabel')}
              name="username"
              rules={[{ required: true, message: t('profile.usernameError') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('profile.emailLabel')}
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: t('profile.emailError'),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('profile.languageLabel')}
              name="language"
              rules={[{ required: true, message: t('profile.languageError') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('profile.themeLabel')}
              name="theme"
              rules={[{ required: true, message: t('profile.themeError') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label={t('profile.passwordLabel')} name="password">
              <Input.Password />
            </Form.Item>

            <div className="text-center">
              <Button type="primary" htmlType="submit" className="me-2">
                {t('profile.saveButton')}
              </Button>
              <Button htmlType="button" onClick={handleCancelChanges}>
                {t('profile.cancelButton')}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label={t('profile.descriptions.username')}>
                {store.user.username}
              </Descriptions.Item>
              <Descriptions.Item label={t('profile.descriptions.email')}>
                {store.user.email}
              </Descriptions.Item>
              <Descriptions.Item label={t('profile.descriptions.language')}>
                {store.user.language}
              </Descriptions.Item>
              <Descriptions.Item label={t('profile.descriptions.theme')}>
                {store.user.theme}
              </Descriptions.Item>
              <Descriptions.Item label={t('profile.descriptions.role')}>
                {store.user.role}
              </Descriptions.Item>
            </Descriptions>
            <div className="text-center mt-4">
              <Button type="primary" onClick={handleEditProfile}>
                {t('profile.editProfileButton')}
              </Button>

              <Button type="primary" onClick={handleSalesforce}>
                {t('profile.createSalesforceButton')}
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Секция для отображения задач Jira */}
      <Card
        bordered={false}
        style={{
          maxWidth: '600px',
          margin: '20px auto',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Title level={4}>{t('profile.jiraTicketsTitle')}</Title>

        <Select
          defaultValue=""
          style={{ width: 200, marginBottom: '16px' }}
          onChange={handleStatusFilterChange}
        >
          <Option value="">{t('profile.allStatus')}</Option>
          <Option value="To Do">{t('profile.toDo')}</Option>
          <Option value="In Progress">{t('profile.inProgress')}</Option>
          <Option value="Done">{t('profile.done')}</Option>
        </Select>

        {loading ? (
          <Spin size="large" />
        ) : (
          <List
            dataSource={tickets}
            renderItem={(ticket) => (
              <List.Item>
                <a
                  href={`https://mahnach20040208.atlassian.net/browse/${ticket.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ticket.fields.summary}
                </a>
              </List.Item>
            )}
          />
        )}

        <Pagination
          current={currentPage}
          total={totalTickets}
          pageSize={10}
          onChange={handlePageChange}
          style={{ textAlign: 'center', marginTop: '20px' }}
        />
      </Card>

      {/* Модальное окно для создания аккаунта в Salesforce */}
      <Modal
        title={t('profile.salesforceModalTitle')}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleSaveSalesforce}>
          <Form.Item label={t('profile.salesforceName')} name="Name">
            {store.user.username}
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
    </div>
  );
});

export default ProfilePage;
