import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useContext } from 'react';
import Login from './components/login/login';
import ProfilePage from './components/profile/profile';
import Register from './components/register/register';
import SidebarMenu from './components/sideBar/sidebar';
import AdminPanel from './components/admin/admin';
import TemplateDetailsPage from './components/template/templateDetailsPage';
import TemplatesPage from './components/template/templatesView/templatePage';
import CreateTemplateModal from './components/template/addTemplate/addTemplateParts/addtemplate';
import TestPage from './components/testPage/testPage';
import Main from './components/home/main';
import Context from '.';
import AddTagPage from './components/tags/addTagPage';
import TemplatesPageAdmin from './components/template/templateAdmin/templateAdmin';
import TemplatesAllPage from './components/template/allTemplates/allTemplates';
import UserTemplateFormsPage from './components/formTable/formTable';
import FormTableAdmin from './components/formTableAdmin/formTableAdmin';
import StatisticsPage from './components/statistic/statistic';

function App() {
  const { store } = useContext(Context);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test/:id" element={<TestPage />} />
      <Route path="/" element={<SidebarMenu />}>
        <Route path="/main" element={<Main />} />
        {store.isAuth && (
          <>
            <Route path="/templates/create" element={<CreateTemplateModal />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/addTags" element={<AddTagPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:id" element={<TemplateDetailsPage />} />
            <Route path="/templates/admin" element={<TemplatesPageAdmin />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/user-forms" element={<UserTemplateFormsPage />} />
            <Route path="/admin-forms" element={<FormTableAdmin />} />
            AdminPanel
          </>
        )}
        <Route path="/templates/all" element={<TemplatesAllPage />} />
      </Route>
    </Routes>
  );
}

export default observer(App);
