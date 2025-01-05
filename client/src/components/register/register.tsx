import React, { useCallback, useContext, useState } from 'react';
import { Typography, Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Context from '../../index';

const { Title, Text } = Typography;
const { Option } = Select;

function Register() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    language: '',
    theme: '',
    role: '',
  });

  const { store } = useContext(Context);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const handleInputChange = useCallback(
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserData((prevState) => ({
          ...prevState,
          [field]: e.target.value,
        }));
      },
    [],
  );

  const handleSelectChange = useCallback(
    (field: string) => (value: string) => {
      setUserData((prevState) => ({
        ...prevState,
        [field]: value,
      }));

      if (field === 'language') {
        i18n.changeLanguage(value);
      }
    },
    [i18n],
  );

  const handleRegister = useCallback(async () => {
    try {
      const { username, email, password, language, theme, role } = userData;
      await store.register(username, email, password, language, theme, role);
      message.success(t('register.successMessage'));
      navigate('/login');
    } catch (error) {
      message.error(t('register.errorMessage'));
    }
  }, [userData, store, navigate, t]);

  return (
    <div className="register-container">
      <div className="register-box">
        <Title level={3} className="form-title">
          {t('register.title')}
        </Title>
        <Text className="form-text">{t('register.formText')}</Text>
        <Form name="registerForm" layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label={t('register.username')}
            name="username"
            rules={[{ required: true, message: t('register.messageUserName') }]}
          >
            <Input
              className="register-input"
              placeholder={t('register.inputUsername')}
              onChange={handleInputChange('username')}
              value={userData.username}
            />
          </Form.Item>

          <Form.Item
            label={t('register.emailLabel')}
            name="email"
            rules={[
              { required: true, message: t('register.emailMessage') },
              { type: 'email', message: t('register.emailError') },
            ]}
          >
            <Input
              className="register-input"
              placeholder={t('register.emailPlaceholder')}
              onChange={handleInputChange('email')}
              value={userData.email}
            />
          </Form.Item>

          <Form.Item
            label={t('register.passwordLabel')}
            name="password"
            rules={[{ required: true, message: t('register.passwordMessage') }]}
          >
            <Input.Password
              className="register-input"
              placeholder={t('register.passwordPlaceholder')}
              onChange={handleInputChange('password')}
              value={userData.password}
            />
          </Form.Item>

          <Form.Item
            label={t('register.languageLabel')}
            name="language"
            rules={[{ required: true, message: t('register.languageMessage') }]}
          >
            <Select
              className="register-input"
              placeholder={t('register.languagePlaceholder')}
              onChange={handleSelectChange('language')}
              value={userData.language}
            >
              <Option value="ru">{t('register.rus')}</Option>
              <Option value="en">{t('register.en')}</Option>
              <Option value="pl">{t('register.pl')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t('register.themeLabel')}
            name="theme"
            rules={[{ required: true, message: t('register.themeMessage') }]}
          >
            <Select
              className="register-input"
              placeholder={t('register.themePlaceholder')}
              onChange={handleSelectChange('theme')}
              value={userData.theme}
            >
              <Option value="black">{t('register.black')}</Option>
              <Option value="white">{t('register.white')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t('register.RoleLabel')}
            name="role"
            rules={[{ required: true, message: t('register.RoleMessage') }]}
          >
            <Select
              className="register-input"
              placeholder={t('register.RolePlaceholder')}
              onChange={handleSelectChange('role')}
              value={userData.role}
            >
              <Option value="user">{t('register.user')}</Option>
              <Option value="admin">{t('register.admin')}</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('register.register')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default observer(Register);
