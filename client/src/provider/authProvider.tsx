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
    if (!store.isAuth && store.user.isBlocked) {
      message.error('Your account is blocked. Please contact support.');
      navigate('/login');
    }
  }, [store.isAuth, store.user.isBlocked, navigate]);

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  return <div>{children}</div>;
};

export default observer(AuthProvider);
