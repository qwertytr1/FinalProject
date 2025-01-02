import React, { useEffect, useState } from 'react';
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
} from 'antd';
import TemplateService from '../../services/templateService';
import QuestionService from '../../services/questionService';
import './testPage.css';

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
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

const TestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateDetails | null>(null);
  const [questions, setQuestions] = useState<QuestionDetails[]>([]);
  const [answer, setAnswer] = useState('');

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
        console.error('Error fetching data:', err);
        setError('Failed to load template or questions.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplateAndQuestions();
    }
  }, [id]);
  console.log(template, questions);
  const renderAnswerField = (question: QuestionDetails) => {
    switch (question.type) {
      case 'single-line':
        return (
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
        );
      case 'multi-line':
        return (
          <TextArea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            rows={4}
          />
        );
      case 'integer':
        return (
          <Input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter a number"
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            checked={answer === 'true'}
            onChange={(e) => setAnswer(e.target.checked ? 'true' : 'false')}
          >
            Select this option
          </Checkbox>
        );
      default:
        return null;
    }
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
              src={template?.imageUrl || 'https://via.placeholder.com/800x400'}
              className="template-image"
            />
          }
          className="template-card"
        >
          <Title level={2}>{template?.title}</Title>
          <Text>{template?.description}</Text> <br />
          <Text strong>
            {`Category: ${template?.category.split(' ').join('\n')}`}
          </Text>
        </Card>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={() => navigate('/')}
            style={{ alignSelf: 'flex-end' }}
          >
            Back to Main Menu
          </Button>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="question-container">
                <Title level={4} className="question-title">
                  {question.title}
                </Title>
                <Text className="question-description">
                  {question.description}
                </Text>
                <div className="answer-field">
                  {renderAnswerField(question)}
                </div>
              </div>
            ))
          ) : (
            <Text>No questions available.</Text>
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default TestPage;
