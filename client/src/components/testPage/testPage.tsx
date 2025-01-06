import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Spin,
  Alert,
  Typography,
  Space,
  Button,
  Input,
  Checkbox,
  Modal,
} from 'antd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import TemplateService from '../../services/templateService';
import QuestionService from '../../services/questionService';
import AnswerService from '../../services/answerService';
import './testPage.css';
import Context from '../..';
import ResultService from '../../services/resultsService';
import FormService from '../../services/formService';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface QuestionDetails {
  id: number;
  title: string;
  type: 'single-line' | 'multi-line' | 'integer' | 'checkbox';
  description: string;
  correctAnswer: string | null;
}

interface TemplateDetails {
  id: number | undefined;
  title: string;
  description: string;
  category: string;
  image_url: string;
}

const TestPage: React.FC = observer(() => {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateDetails | null>(null);
  const [questions, setQuestions] = useState<QuestionDetails[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answerStatus, setAnswerStatus] = useState<
    Record<number, boolean | null>
  >({});
  const [disabledButtons, setDisabledButtons] = useState<
    Record<number, boolean>
  >({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [percentage, setPercentage] = useState<number | null>(null);
  const handleStartTest = async () => {
    if (id) {
      setLoading(true);
      setError(null);
      try {
        store.resetCounts();
        const response = await FormService.formPost(Number(id));
        store.setFormId(response.data.form.id);
        navigate(`/test/${id}`);
        setIsModalVisible(false);
        setAnswers({});
        setAnswerStatus({});
        setDisabledButtons({});
      } catch (err) {
        setError(t('test_page.error'));
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const fetchTemplateAndQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const [templateResponse, questionsResponse] = await Promise.all([
          TemplateService.getTemplateById(Number(id)),
          QuestionService.getQuestion(Number(id)),
        ]);

        setTemplate(templateResponse.data);
        setQuestions(questionsResponse.data || []);
      } catch (err) {
        setError('Failed to load template or questions.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplateAndQuestions();
    }
  }, [id]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmitAnswer = async (
    questionId: number,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    if (!answers[questionId] || !store.formId) return;

    try {
      setError(null);
      const response = await AnswerService.answerPost({
        answer: answers[questionId],
        forms_id: store.formId,
        questions_id: questionId,
      });
      const { is_correct: isCorrect } = response.data.dataValues;

      setAnswerStatus((prevStatus) => ({
        ...prevStatus,
        [questionId]: isCorrect,
      }));

      store.incrementAnsweredQuestions();
      if (isCorrect) {
        store.incrementCorrectAnswers();
      }
      setDisabledButtons((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    } catch (err) {
      setError('Failed to submit the answer.');
    } finally {
      setLoading(false);
    }
  };
  const handleFinishTest = async () => {
    const totalQuestions = questions.length;
    const correctAnswers = store.correctAnswersCount;
    const calculatedPercentage = Math.round(
      (correctAnswers / totalQuestions) * 100,
    );
    setPercentage(calculatedPercentage);
    try {
      await ResultService.resultPost(
        Number(store.formId),
        store.correctAnswersCount,
      );
      setIsModalVisible(true);
    } catch (err) {
      setError('Failed to submit the result.');
    }
  };

  const renderAnswerField = (question: QuestionDetails) => {
    const currentAnswer = answers[question.id] || '';
    const isDisabled = disabledButtons[question.id];

    switch (question.type) {
      case 'single-line':
        return (
          <Input
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={t('test_page.enter_answer')}
            disabled={isDisabled}
          />
        );
      case 'multi-line':
        return (
          <TextArea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={t('test_page.enter_answer')}
            rows={4}
            disabled={isDisabled}
          />
        );
      case 'integer':
        return (
          <Input
            type="number"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={t('test_page.enter_answer')}
            disabled={isDisabled}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            checked={currentAnswer === 'true'}
            onChange={(e) =>
              handleAnswerChange(
                question.id,
                e.target.checked ? 'true' : 'false',
              )
            }
            disabled={isDisabled}
          >
            Select this option
          </Checkbox>
        );
      default:
        return null;
    }
  };
  const getQuestionClass = (questionId: number) => {
    const status = answerStatus[questionId];
    if (status === true) return 'question-container correct';
    if (status === false) return 'question-container incorrect';
    return 'question-container';
  };

  if (loading) {
    return (
      <div className="test-page-spinner">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-page-error">
        <Alert message={error} type="error" />
      </div>
    );
  }

  return (
    <Layout className="test-page-layout">
      <Content className="test-page-content">
        <Card
          cover={
            <img
              alt={template?.title}
              src={template?.image_url || 'https://via.placeholder.com/800x400'}
              className="template-image"
            />
          }
          className="template-card"
        >
          <Title level={2}>{template?.title}</Title>
          <Text>{template?.description}</Text> <br />
          <Text strong>
            {t('test_page.category')}:{template?.category.split(' ').join('\n')}
          </Text>
        </Card>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={() => navigate('/')}
            style={{ alignSelf: 'flex-end' }}
          >
            {t('test_page.back_to_main_menu')}
          </Button>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className={getQuestionClass(question.id)}>
                <Title level={4} className="question-title">
                  {question.title}
                </Title>
                <Text className="question-description">
                  {question.description}
                </Text>
                <div className="answer-field">
                  {renderAnswerField(question)}
                </div>
                <Button
                  type="primary"
                  style={{ marginTop: '10px' }}
                  onClick={(e) => handleSubmitAnswer(question.id, e)}
                  disabled={disabledButtons[question.id]}
                >
                  {t('test_page.submit')}
                </Button>
              </div>
            ))
          ) : (
            <Text> {t('test_page.no_questions')}</Text>
          )}
        </Space>
        <Button
          type="primary"
          style={{ marginTop: '10px' }}
          onClick={handleFinishTest}
        >
          {t('test_page.finish')}
        </Button>

        <Modal
          title={t('test_page.test_progress')}
          visible={isModalVisible}
          footer={[
            <Button key="back" onClick={() => navigate('/')}>
              {t('test_page.exit')}
            </Button>,
            <Button key="retry" type="primary" onClick={handleStartTest}>
              {t('test_page.retry')}
            </Button>,
          ]}
        >
          <Text>
            {' '}
            {t('test_page.progress')} {percentage}%
          </Text>
        </Modal>
      </Content>
    </Layout>
  );
});

export default TestPage;
