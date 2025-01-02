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
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const { i18n, t } = useTranslation();

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    [],
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [],
  );

  const handleLanguageChange = useCallback(
    (value: string) => {
      setLanguage(value);
      i18n.changeLanguage(value);
    },
    [i18n],
  );

  const handleThemeChange = useCallback((value: string) => {
    setTheme(value);
  }, []);

  const handleRoleChange = useCallback((value: string) => {
    setRole(value);
  }, []);

  const handleRegister = useCallback(async () => {
    try {
      await store.register(username, email, password, language, theme, role);
      message.success(t('register.successMessage')); // Используем перевод для сообщения
      navigate('/login');
    } catch (error) {
      message.error(t('register.errorMessage'));
    }
  }, [username, email, password, language, theme, role, store, navigate, t]);

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
              onChange={handleUsernameChange}
              value={username}
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
              onChange={handleEmailChange}
              value={email}
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
              onChange={handlePasswordChange}
              value={password}
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
              onChange={handleLanguageChange}
              value={language}
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
              onChange={handleThemeChange}
              value={theme}
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
              onChange={handleRoleChange}
              value={role}
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
