import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Input, Select, Spin, Alert, List } from 'antd';
import { useParams } from 'react-router-dom';
import TemplateService from '../../services/templateService';
import QuestionService from '../../services/questionService';
import { Templates } from '../../models/templates';
import { Questions } from '../../models/questions';

const { Option } = Select;

const TemplateDetailsPage = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState<Templates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionDetails, setQuestionDetails] = useState({
    title: '',
    type: '',
    description: '',
    correctAnswer: '',
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await TemplateService.getTemplateById(Number(id));
        setTemplate(response.data);
        setQuestions(response.data.questions || []);
      } catch (err) {
        setError('Failed to load template details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const handleAddQuestionClick = () => {
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = async () => {
    if (!questionDetails.title || !questionDetails.type) {
      setError('Please provide a question title and select a type.');
      return;
    }

    try {
      const newQuestion: Questions = {
        title: questionDetails.title,
        type: questionDetails.type,
        description: questionDetails.description,
        correctAnswer: questionDetails.correctAnswer,
      };

      const response = await QuestionService.addQuestion(
        Number(id),
        newQuestion,
      );
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);

      setQuestionDetails({
        title: '',
        type: '',
        description: '',
        correctAnswer: '',
      });
      setShowQuestionForm(false);
    } catch (err) {
      setError('Failed to add question.');
    }
  };
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await QuestionService.getQuestion(Number(id));
        setQuestions(response.data || []); // Устанавливаем все вопросы
        console.log('Questions:', response);
      } catch (err) {
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestions();
    }
  }, [id]);
  console.log('Questions State:', questions);
  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Spin tip="Loading template...">
          <div style={{ height: '200px' }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!template) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="Template not found" type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card
        cover={
          <img
            alt={template.title}
            src={template.imageUrl || 'https://via.placeholder.com/300x200'}
          />
        }
      >
        <h2>{template.title}</h2>
        <p>{template.description}</p>
        <p>Category: {template.category}</p>
      </Card>

      <h3>Questions ({questions.length})</h3>
      {questions.length > 0 ? (
        <List
          dataSource={questions}
          renderItem={(question) => (
            <List.Item>
              <Card title={question.title}>
                <p>Type: {question.type}</p>
                <p>Description: {question.description || 'No description'}</p>
                {question.correctAnswer && (
                  <p>Correct Answer: {question.correctAnswer}</p>
                )}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Alert message="No questions available." type="info" showIcon />
        </div>
      )}

      <Button
        type="primary"
        onClick={handleAddQuestionClick}
        style={{ marginBottom: '20px' }}
      >
        Add Question
      </Button>

      {showQuestionForm && (
        <Form layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item label="Question Title" required>
            <Input
              value={questionDetails.title}
              onChange={(e) =>
                setQuestionDetails({
                  ...questionDetails,
                  title: e.target.value,
                })
              }
              placeholder="Enter question title"
            />
          </Form.Item>
          <Form.Item label="Question Type" required>
            <Select
              value={questionDetails.type}
              onChange={(value) =>
                setQuestionDetails({ ...questionDetails, type: value })
              }
              placeholder="Select question type"
            >
              <Option value="single-line">Single Line</Option>
              <Option value="multi-line">Multi-Line</Option>
              <Option value="integer">Integer</Option>
              <Option value="checkbox">Checkbox</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Question Description">
            <Input.TextArea
              value={questionDetails.description}
              onChange={(e) =>
                setQuestionDetails({
                  ...questionDetails,
                  description: e.target.value,
                })
              }
              placeholder="Enter question description (optional)"
            />
          </Form.Item>
          <Form.Item label="Correct Answer">
            <Input
              value={questionDetails.correctAnswer}
              onChange={(e) =>
                setQuestionDetails({
                  ...questionDetails,
                  correctAnswer: e.target.value,
                })
              }
              placeholder="Enter correct answer (optional)"
            />
          </Form.Item>
          <Button type="primary" onClick={handleSaveQuestion}>
            Save Question
          </Button>
        </Form>
      )}
    </div>
  );
};

export default TemplateDetailsPage;
