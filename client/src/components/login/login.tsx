import React, { useContext, useState } from "react";
import { Typography, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom"; // Для перенаправления
import axios from "axios";
import "./login.css";
import { Context } from "../../index";
import { observer } from 'mobx-react-lite';
const { Title, Text } = Typography;

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {store } = useContext(Context)

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={3}>Welcome Back</Title>
        <Text>Please login to your account</Text>
        <Form
          name="loginForm"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className="login-input" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} value={email} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className="login-input" placeholder="Enter your password" onChange={e => setPassword(e.target.value)} value={password}/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block onClick={()=>store.login(email,password)}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Text>

        </Text>
      </div>
    </div>
  );
}

export default observer(Login);