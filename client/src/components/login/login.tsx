import React, { useCallback, useContext, useState } from "react";
import { Typography, Form, Input, Button, message } from "antd";
import "./login.css";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleLogin = async () => {
    try {
      await store.login(email, password);
      message.success("Login successful");
      navigate("/Profile");
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    }
  };

  const handleRegistrationRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={3}>Welcome Back</Title>
        <Text>Please login to your account</Text>
        <Form
          name="loginForm"
          layout="vertical"
          onFinish={handleLogin}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              className="login-input"
              placeholder="Enter your email"
              onChange={handleEmailChange}
              value={email}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="login-input"
              placeholder="Enter your password"
              onChange={handlePasswordChange}
              value={password}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="registration-link">
          <Text>Don't have an account? </Text>
          <Button type="link" onClick={handleRegistrationRedirect}>
            Register here
          </Button>
        </div>
      </div>
    </div>
  );
}

export default observer(Login);
