import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Typography, Divider, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import FormService from '../../services/formService';
import Context from '../..';
import './formTable.css';

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

const FormTable: React.FC = observer(() => {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Form | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!store.user.id) return;
      const response = await FormService.getUserTemplates(store.user.id);
      if (response.status === 200) {
        setTemplates(response.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [store.user.id]);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem('theme') || store.theme || 'light-theme';
    document.body.classList.add(savedTheme);
    return () => {
      document.body.classList.remove(savedTheme);
    };
  }, [store.theme]);

  const handleFormClick = async (formId: number) => {
    const response = await FormService.getFormUser(formId);
    if (response.status === 200) {
      setModalData(response.data);
      setModalVisible(true);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin tip={t('forms.loading')} size="large" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Title level={1} className={`page-title ${store.theme}`}>
        {t('forms.created')} {store.user.username}
      </Title>
      {templates.length > 0 ? (
        templates.map((template) => (
          <div key={template.id} className="template-container">
            <Title level={2} className="template-title">
              {template.title}
            </Title>
            <ul className="form-list">
              {template.forms && template.forms.length > 0 ? (
                template.forms.map((form) => (
                  <li key={form.id} className="form-item">
                    <strong>{form.user.username}</strong> {t('forms.filled')}
                    <Button
                      type="primary"
                      size="small"
                      className="form-button"
                      onClick={() => handleFormClick(form.id)}
                    >
                      {t('forms.buttonForm')}
                    </Button>
                  </li>
                ))
              ) : (
                <li>{t('forms.noForm')}</li>
              )}
            </ul>
          </div>
        ))
      ) : (
        <div className="no-templates-message">{t('forms.noTemplates')}</div>
      )}

      {modalVisible && modalData && (
        <Modal
          title={t('forms.title')}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
          centered
          className="modal-container"
        >
          <Typography>
            <Title level={4} className="modal-title">
              {t('forms.formBy')} {modalData.user.username}
            </Title>
            <Text strong>{t('forms.template')}: </Text>
            <Text>{modalData.template.title}</Text>
            <Divider />
            <Text strong>{t('forms.answer')}</Text>
            <div className="answers-container">
              {modalData.answers && modalData.answers.length > 0 ? (
                modalData.answers.map((answer) => (
                  <div key={answer.id} className="answer-item">
                    <Text>{answer.question.title}:</Text>
                    <div
                      className={`answer-box ${answer.is_correct ? 'correct-answer' : 'incorrect-answer'}`}
                    >
                      <Text>{answer.answer}</Text>
                    </div>
                  </div>
                ))
              ) : (
                <div>{t('forms.noAnswer')}</div>
              )}
            </div>
          </Typography>
        </Modal>
      )}
    </div>
  );
});

export default FormTable;
