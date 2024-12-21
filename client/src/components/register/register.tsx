import React, { useState } from "react";
import { Typography, Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom"; // Для перенаправления после регистрации
import axios from "axios";
import "./register.css";
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
  const [form] = Form.useForm();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const navigate = useNavigate(); // Для перенаправления

  const handleSubmit = async (values: RegisterFormValues) => {
    setIsFormSubmitted(true);
    try {
      // Отправка данных на сервер
      const response = await axios.post(`${API_URL}/api/register`, values);
      message.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Перенаправляем на страницу логина
      return response.data;
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      message.error("Failed to register. Please try again.");
    } finally {
      setIsFormSubmitted(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <Title level={3} className={`form-title ${isFormSubmitted ? "animate" : ""}`}>
          Register
        </Title>
        <Text className="form-text">
          Create an account to get started. <span className="former">Former</span>
        </Text>
        <Form
          form={form}
          name="registerForm"
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input className="register-input" placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className="register-input" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className="register-input" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Language"
            name="language"
            rules={[{ required: true, message: "Please select your language!" }]}
          >
            <Select className="register-input" placeholder="Select your language">
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
            <Select className="register-input" placeholder="Select your theme">
              <Option value="black">Black</Option>
              <Option value="white">White</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select className="register-input" placeholder="Select your role">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isFormSubmitted}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <Text>

        </Text>
      </div>
    </div>
  );
}

export default Register;
