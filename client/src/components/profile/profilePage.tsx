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
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import Context from '../..';

const { Title } = Typography;

const ProfilePage = observer(() => {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const initialValues = {
    username: store.user.username || '',
    email: store.user.email || '',
    language: store.user.language || '',
    theme: store.user.theme || '',
    password: '',
  };

  // Определите класс для темной/светлой темы на уровне компонента
  const darkMode = store.user.theme === 'dark';

  const handleEditProfile = () => {
    setIsEditing(true);
    form.setFieldsValue(initialValues);
  };

  const handleCancelChanges = () => {
    setIsEditing(false);
    form.resetFields();
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

  // Функция для обновления класса body
  const updateBodyClass = (theme: string) => {
    // Удаляем старые классы
    document.body.classList.remove('dark-theme', 'light-theme');
    // Добавляем новый класс
    document.body.classList.add(`${theme}-theme`);
  };
  const handleThemeChange = (checked: boolean) => {
    // Сохраните новый выбор темы в store и обновите класс
    const newTheme = checked ? 'dark' : 'light';
    store.user.theme = newTheme;
    updateBodyClass(newTheme);
  };
  useEffect(() => {
    // Проверим текущий класс на body
    const currentClass = document.body.classList.contains('dark-theme')
      ? 'dark'
      : 'light';
    if (store.user.theme !== currentClass) {
      store.user.theme = currentClass; // Обновим тему в store, если нужно
    }
    // Обновляем класс на body при изменении темы
    updateBodyClass(store.user.theme);
  }, [store.user, store.user.theme]);

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

        {/* Переключатель темы */}
        <div className="theme-switcher">
          <span>{t('profile.themeLabel')}</span>
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </div>

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
            </div>
          </>
        )}
      </Card>
    </div>
  );
});

export default ProfilePage;
