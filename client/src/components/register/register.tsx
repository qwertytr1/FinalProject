import React, { useContext, useState } from "react";
import { Typography, Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom"; // Для перенаправления после регистрации
import axios from "axios";
import "./register.css";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

const API_URL = process.env.REACT_APP_API_URL;
const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  language: string;
  theme: string;
  role: string;
}

function Register() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const { store } = useContext(Context);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <Title level={3} className={`form-title}`}>
          Register
        </Title>
        <Text className="form-text">
          Create an account to get started. <span className="former">Former</span>
        </Text>
        <Form
          name="registerForm"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              className="register-input"
              placeholder="Enter your username"
              onChange={e => setUsername(e.target.value)}
              value={username}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              className="register-input"
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="register-input"
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </Form.Item>

          <Form.Item
            label="Language"
            name="language"
            rules={[{ required: true, message: "Please select your language!" }]}
          >
            <Select
              className="register-input"
              placeholder="Select your language"
              onChange={handleLanguageChange}
              value={language}
            >
              <Option value="ru">Russian</Option>
              <Option value="en">English</Option>
              <Option value="pl">Polish</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Theme"
            name="theme"
            rules={[{ required: true, message: "Please select your theme!" }]}
          >
            <Select
              className="register-input"
              placeholder="Select your theme"
              onChange={handleThemeChange}
              value={theme}
            >
              <Option value="black">Black</Option>
              <Option value="white">White</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select
              className="register-input"
              placeholder="Select your role"
              onChange={handleRoleChange}
              value={role}
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block onClick={()=>store.registration(username,email,password, language, theme,role)}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default observer( Register);
