import React, { useState, useEffect, useContext } from "react";
import { Button, Card, List, Collapse, message, Popconfirm } from "antd";
import UserService from "../../services/UserService";
import { IUser } from "../../models/IUser";
import { Context } from "../..";

const { Panel } = Collapse;

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]); // Управляем состоянием пользователей внутри компонента
  const [isLoading, setIsLoading] = useState(false);
 const { store } = useContext(Context);
  const handleBlockUser = async (userId: number) => {
    setIsLoading(true);
    try {
      await UserService.toggleBlock(userId.toString());
      message.success(`User ${userId} has been blocked`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked: true } : user
        )
      );
    } catch (error) {
      console.error("Error blocking user:", error);
      message.error("Failed to block user.");
    } finally {
      setIsLoading(false);
    }
  };

  // Unblock user
  const handleUnblockUser = async (userId: number) => {
    setIsLoading(true);
    try {
      await UserService.toggleUnblock(userId.toString());
      message.success(`User ${userId} has been unblocked`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked: false } : user
        )
      );
    } catch (error) {
      console.error("Error unblocking user:", error);
      message.error("Failed to unblock user.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGetUsers = async () => {

    const response =await store.getUsers();
    const ss =  response;
    // setUsers(response);
  };
  useEffect(() => {
    store.getUsers();
  }, []);

  return (
    <Card title="Admin Panel" className="mt-4">
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="User List" key="1">
          <Button type="primary" onClick={handleGetUsers} className="mb-3" loading={isLoading}>
            Refresh User List
          </Button>
          {users.length > 0 ? (
            <List
              bordered
              dataSource={users}
              renderItem={(user) => (
                <List.Item key={user.id}>
                  <strong>{user.username}</strong> - {user.email}
                  <div style={{ marginLeft: "auto" }}>
                    {user.isBlocked ? (
                      <Popconfirm
                        title={`Are you sure you want to unblock this user?`}
                        onConfirm={() => handleUnblockUser(user.id)}
                      >
                        <Button type="link">Unblock</Button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title={`Are you sure you want to block this user?`}
                        onConfirm={() => handleBlockUser(user.id)}
                      >
                        <Button type="link">Block</Button>
                      </Popconfirm>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div>No users available</div>
          )}
        </Panel>
      </Collapse>
    </Card>
  );
};

export default AdminPanel;
