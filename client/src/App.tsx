import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';

import { Context } from '.';
import { observer } from 'mobx-react-lite';
import UserService from './services/UserService';
import { IUser } from './models/IUser';
import ProfilePage from './components/profile/profile';
import Register from './components/register/register';
import SidebarMenu from './components/sideBar/sidebar';
import AdminPanel from './components/admin/admin';


function App() {
  return (
      <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<SidebarMenu />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="/statistics"
            element={<div>Здесь будет страница статистики</div>}
          />
        </Route>
  </Routes>
  );
}

export default observer(App);