import React, { useContext, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';
import Register from "./components/register/register";
import { Context } from '.';
import { observer } from 'mobx-react-lite';


function App() {
  const {store } = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      console.log('ss')
        store.checkAuth();
    }
}, []);

if (!store.isAuth) {
  return (
      <div>
          <Login/>
      </div>
  );
}
  return (
    <div className="App">
        <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
      <button onClick={() => store.logout()}>exit</button>
      </div>
  );
}

export default observer(App);