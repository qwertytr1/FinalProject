import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Input, Select, Spin, Alert, Checkbox } from 'antd';
import { useParams } from 'react-router-dom'; // Use this to get the URL params
import TemplateService from '../../services/templateService';
import QuestionService from '../../services/questionService';
import { Templates } from '../../models/templates';
import { Questions } from '../../models/questions';

const { Option } = Select;

const TemplateDetailsPage = () => {
  const { id } = useParams(); // Get the template ID from the URL params
  const [template, setTemplate] = useState<Templates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await TemplateService.getTemplateById(Number(id)); // Ensure that the ID is a number
        setTemplate(response.data);
        setQuestions(response.data.questions || []); // Ensure questions are set correctly
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

  const handleAddQuestion = async (values: Questions) => {
    try {
      await QuestionService.addQuestion(Number(id), values);
      setQuestions((prev) => [...prev, values]); // Add the new question
      setShowQuestionForm(false); // Hide the form
    } catch (err) {
      setError('Failed to add question.');
    }
  };

  const handleAddQuestionClick = () => {
    setShowQuestionForm(true);
  };

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

      <h3>Questions</h3>
      {questions.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={handleAddQuestionClick}>
            Add Question
          </Button>
        </div>
      ) : (
        <ul>
          {questions.map((question) => (
            <li key={question.id}>{question.title}</li>
          ))}
        </ul>
      )}

      {showQuestionForm && (
        <Form
          onFinish={handleAddQuestion}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="title"
            label="Question Title"
            rules={[
              { required: true, message: 'Please enter the question title' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="type"
            label="Question Type"
            rules={[{ required: true, message: 'Please select question type' }]}
          >
            <Select>
              <Option value="single-line">Single Line</Option>
              <Option value="multi-line">Multi-Line</Option>
              <Option value="integer">Integer</Option>
              <Option value="checkbox">Checkbox</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="order"
            label="Order"
            rules={[{ required: true, message: 'Please specify the order' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="showInResults"
            label="Show in Results"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item name="correct_answer" label="Correct Answer">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Question
          </Button>
        </Form>
      )}
    </div>
  );
};

export default TemplateDetailsPage;
