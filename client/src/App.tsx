import './App.css';
import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Login from './components/login/login';
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
