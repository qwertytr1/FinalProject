
import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Form, Input, Typography, Descriptions } from "antd";
import { Context } from "../..";

const { Title } = Typography;

const ProfilePage = observer(() => {
  const { store } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);


  const [form] = Form.useForm();
  const initialValues = {
    username: store.user.username || "",
    email: store.user.email || "",
    language: store.user.language || "",
    theme: store.user.theme || "",
    password: "",
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    form.setFieldsValue(initialValues);
  };

  const handleCancelChanges = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSaveChanges = async (values: typeof initialValues) => {
    await store.handleSaveChanges(values);
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <Card
        bordered={false}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} className="text-center">Profile Page</Title>

        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSaveChanges}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true, message: "Please input your language!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Theme"
              name="theme"
              rules={[{ required: true, message: "Please input your theme!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Password" name="password">
              <Input.Password />
            </Form.Item>

            <div className="text-center">
              <Button type="primary" htmlType="submit" className="me-2">
                Save
              </Button>
              <Button htmlType="button" onClick={handleCancelChanges}>
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Username">{store.user.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{store.user.email}</Descriptions.Item>
              <Descriptions.Item label="Language">{store.user.language}</Descriptions.Item>
              <Descriptions.Item label="Theme">{store.user.theme}</Descriptions.Item>
              <Descriptions.Item label="Role">{store.user.role}</Descriptions.Item>
            </Descriptions>
            <div className="text-center mt-4">
              <Button type="primary" onClick={handleEditProfile}>
                Edit Profile
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
});

export default ProfilePage;
