import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { Link } from 'react-router-dom';

// // Определяем типы данных
// interface User {
//   id: number;
//   username: string;
//   email: string;
// }

// interface Template {
//   id: number;
//   title: string;
//   description: string;
// }

// interface Form {
//   id: number;
//   templateId: number;
//   answers: string[];
// }

// const MainPage: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [forms, setForms] = useState<Form[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Получаем ID пользователя из куков
//         const userId = Cookies.get('user_id');
//         if (!userId) throw new Error('User is not authenticated');

//         // Делаем запросы к API
//         const [userResponse, templatesResponse, formsResponse] = await Promise.all([
//           axios.get<User>(`/api/user/${userId}`),
//           axios.get<Template[]>(`/api/templates?user_id=${userId}`),
//           axios.get<Form[]>(`/api/forms?user_id=${userId}`),
//         ]);

//         setUser(userResponse.data);
//         setTemplates(templatesResponse.data);
//         setForms(formsResponse.data);
//       } catch (error) {
//         console.error('Ошибка при загрузке данных:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) return <div>Загрузка...</div>;
//   if (!user) return <div>Пожалуйста, войдите в систему.</div>;

//   return (
//     <div className="container mt-4">
//       <h1>Добро пожаловать, {user.username}!</h1>

//       <div className="my-4">
//         <h2>Ваши шаблоны</h2>
//         {templates.length > 0 ? (
//           <ul className="list-group">
//             {templates.map(template => (
//               <li key={template.id} className="list-group-item">
//                 <Link to={`/templates/${template.id}`}>{template.title}</Link>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>У вас пока нет созданных шаблонов.</p>
//         )}
//         <Link to="/create?type=template" className="btn btn-primary mt-3">Создать шаблон</Link>
//       </div>

//       <div className="my-4">
//         <h2>Ваши заполненные формы</h2>
//         {forms.length > 0 ? (
//           <ul className="list-group">
//             {forms.map(form => (
//               <li key={form.id} className="list-group-item">
//                 <Link to={`/forms/${form.id}`}>Форма #{form.id}</Link>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>У вас пока нет заполненных форм.</p>
//         )}
//         <Link to="/create?type=form" className="btn btn-primary mt-3">Заполнить форму</Link>
//       </div>
//     </div>
//   );
// };

// export default MainPage;
