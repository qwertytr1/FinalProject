import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Typography, Divider } from 'antd';
import FormService from '../../services/formService';
import Context from '../..';

const { Title, Text } = Typography;

interface User {
  id: number;
  username: string;
  email: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
  correct_answer: string;
}

interface Answer {
  id: number;
  answer: string;
  is_correct: boolean;
  question: Question;
  user: User;
}

interface Form {
  id: number;
  user: User;
  template: { id: number; title: string };
  answers: Answer[];
}

interface Template {
  id: number;
  title: string;
  forms: Form[] | undefined;
}

interface UserTemplateFormsPageProps {
  userId: number | undefined;
}

const UserTemplateFormsPage: React.FC<UserTemplateFormsPageProps> = ({
  userId,
}) => {
  const { store } = useContext(Context);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Form | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const response = await FormService.getUserTemplates(userId);
      if (response.status === 200) {
        setTemplates(response.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [userId]);

  const handleFormClick = async (formId: number) => {
    const response = await FormService.getFormUser(formId);
    if (response.status === 200) {
      setModalData(response.data);
      setModalVisible(true);
    }
  };
  useEffect(() => {
    console.log(modalData); // Логируем данные modalData при изменении
  }, [modalData]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Шаблоны, созданные пользователем {store.user.username}</h1>

      {templates.length > 0 ? (
        templates.map((template) => (
          <div key={template.id} style={{ marginBottom: '20px' }}>
            <h2>{template.title}</h2>
            <ul>
              {template.forms && template.forms.length > 0 ? (
                template.forms.map((form) => (
                  <li key={form.id}>
                    <strong>{form.user.username}</strong> заполнил форму:
                    <Button
                      type="link"
                      onClick={() => handleFormClick(form.id)}
                    >
                      Просмотр формы
                    </Button>
                  </li>
                ))
              ) : (
                <li>Нет заполненных форм для этого шаблона.</li>
              )}
            </ul>
          </div>
        ))
      ) : (
        <div>Нет доступных шаблонов.</div>
      )}

      {modalVisible && modalData && (
        <Modal
          title="Детали формы"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
          centered
          style={{
            padding: '20px',
            backgroundColor: '#f4f7fa',
            borderRadius: '8px',
          }}
        >
          <Typography>
            <Title level={4}>Форма от {modalData.user.username}</Title>
            <Text strong>Шаблон: </Text>
            <Text>{modalData.template.title}</Text>
            <Divider />
            <Text strong>Ответы:</Text>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {modalData.answers && modalData.answers.length > 0 ? (
                modalData.answers.map((answer) => (
                  <div key={answer.id} style={{ marginBottom: '10px' }}>
                    <Text>{answer.question.title}:</Text>
                    <div
                      style={{
                        padding: '8px',
                        backgroundColor: answer.is_correct
                          ? '#e6f7e6'
                          : '#fff2f0',
                        borderRadius: '4px',
                        marginTop: '4px',
                      }}
                    >
                      <Text>{answer.answer}</Text>
                    </div>
                  </div>
                ))
              ) : (
                <div>Нет ответов для этой формы.</div>
              )}
            </div>
          </Typography>
        </Modal>
      )}
    </div>
  );
};

export default UserTemplateFormsPage;
