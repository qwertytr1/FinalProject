import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Context from '..';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token') && !store.isCheckedAuth) {
      store.checkAuth();
    }
  }, [store]);
  useEffect(() => {
    // If the user is logged in but blocked, handle it by showing a message and redirecting
    if (store.isAuth && store.user.isBlocked) {
      message.error('Your account is blocked. Please contact support.');
      navigate('/login'); // Redirect to login page if the user is blocked
    }
  }, [store.isAuth, store.user.isBlocked, navigate]);

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  return <div>{children}</div>;
};

export default observer(AuthProvider);
