import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Spin,
  Alert,
  List,
  Modal,
  Tooltip,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { DeleteOutlined } from '@ant-design/icons';
import TemplateService from '../../services/templateService';
import QuestionService from '../../services/questionService';
import { Templates } from '../../models/templates';
import { Questions } from '../../models/questions';
import FormService from '../../services/formService';
import Context from '../..';
import CommentsService from '../../services/commentsService';

const { Option } = Select;
interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: { username: string };
}
const TemplateDetailsPage = observer(() => {
  const { store } = useContext(Context);
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Templates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showTemplateEditForm, setShowTemplateEditForm] = useState(false);
  const [questionDetails, setQuestionDetails] = useState<Questions>({
    id: 0,
    title: '',
    type: '',
    description: '',
    correct_answer: '',
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [templateDetails, setTemplateDetails] = useState<{
    title: string;
    description: string;
    category: string;
  }>({
    title: '',
    description: '',
    category: '',
  });
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const handleDeleteTemplate = async (
    templateId: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    Modal.confirm({
      title: t('templateDetailsPage.deleteTemplateTitle'),
      content: t('templateDetailsPage.deleteTemplateContent'),
      okText: t('templateDetailsPage.okText'),
      okType: 'danger',
      cancelText: t('templateDetailsPage.cancelText'),
      async onOk() {
        try {
          setLoading(true);
          await TemplateService.deleteTemplate(templateId);
          navigate('/templates');
        } catch (err) {
          setError(t('templateDetailsPage.errorMessage'));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await TemplateService.getTemplateById(Number(id));
        setTemplate(response.data);
        setTemplateDetails({
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
        });
      } catch (err) {
        console.error('Error fetching template:', err);
        setError(t('templateDetailsPage.errorMessage'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id, t]);

  const handleAddQuestionClick = () => {
    setIsEditingQuestion(false);
    setQuestionDetails({
      id: 0,
      title: '',
      type: '',
      description: '',
      correct_answer: '',
    });
    setShowQuestionForm(true);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await QuestionService.getQuestion(Number(id));
        setQuestions(response.data || []);
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

  const handleSaveQuestion = async () => {
    if (!questionDetails.title || !questionDetails.type) {
      setError(t('templateDetailsPage.errorMessage'));
      return;
    }

    try {
      const newQuestion: Questions = {
        id: questionDetails.id,
        title: questionDetails.title,
        type: questionDetails.type,
        description: questionDetails.description,
        correct_answer: questionDetails.correct_answer,
      };

      const response = await QuestionService.addQuestion(
        Number(id),
        newQuestion,
      );
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);

      setQuestionDetails({
        id: 0,
        title: '',
        type: '',
        description: '',
        correct_answer: '',
      });
      setShowQuestionForm(false);
    } catch (err) {
      setError(t('templateDetailsPage.errorAddQuestion'));
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await QuestionService.deleteQuestion(Number(id), questionId);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId),
      );
    } catch (err) {
      setError(t('templateDetailsPage.errorDeleteQuestion'));
    }
  };

  const handleSaveEditedQuestion = async () => {
    if (!questionDetails.title || !questionDetails.type) {
      setError(t('templateDetailsPage.errorEmptyFields'));
      return;
    }

    try {
      const updatedQuestion = {
        title: questionDetails.title,
        type: questionDetails.type,
        description: questionDetails.description,
        correct_answer: questionDetails.correct_answer,
      };

      await QuestionService.editQuestion(
        Number(id),
        questionDetails.id,
        updatedQuestion,
      );

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionDetails.id ? { ...q, ...updatedQuestion } : q,
        ),
      );

      setShowQuestionForm(false);
      setQuestionDetails({
        id: 0,
        title: '',
        type: '',
        description: '',
        correct_answer: '',
      });
    } catch (err) {
      setError(t('templateDetailsPage.errorUpdateQuestion'));
    }
  };

  const handleEditQuestion = (question: Questions) => {
    setIsEditingQuestion(true);
    setQuestionDetails({
      id: question.id,
      title: question.title,
      type: question.type,
      description: question.description || '',
      correct_answer: question.correct_answer || '',
    });
    setShowQuestionForm(true);
  };
  useEffect(() => {
    const fetchComments = async () => {
      if (id) {
        try {
          const response = await CommentsService.getComment(Number(id));
          console.log(response.data);
          setComments(response.data || []);
        } catch (err) {
          setError('Failed to load comments.');
        }
      }
    };

    fetchComments();
  }, [id]);

  // Handle new comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await CommentsService.commentPost(
        Number(id),
        newComment,
      );
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  // Polling to refresh comments every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      const fetchComments = async () => {
        if (id) {
          try {
            const response = await CommentsService.getComment(Number(id));
            setComments(response.data || []);
          } catch (err) {
            setError('Failed to load comments.');
          }
        }
      };

      fetchComments();
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [id]);
  const handleDeleteComment = async (commentId: number) => {
    try {
      await CommentsService.commentDelete(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateDetails.title || !templateDetails.category) {
      setError(t('templateDetailsPage.errorEmptyFields'));
      return;
    }

    try {
      const updatedTemplate = {
        title: templateDetails.title,
        description: templateDetails.description,
        category: templateDetails.category,
      };

      await TemplateService.editTemplate(Number(id), updatedTemplate);
      const response = await TemplateService.getTemplateById(Number(id));
      setTemplate(response.data);
      setTemplateDetails(updatedTemplate);
      setShowTemplateEditForm(false);
    } catch (err) {
      setError(t('templateDetailsPage.errorUpdateTemplate'));
    }
  };

  const handleStartTest = async () => {
    if (id) {
      setLoading(true);
      setError(null);
      try {
        store.resetCounts();
        const response = await FormService.formPost(Number(id));
        store.setFormId(response.data.form.id);
        navigate(`/test/${id}`);
      } catch (err) {
        console.error(err);
        setError('Failed to load the form data.');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleTemplateTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemplateDetails({
        ...templateDetails,
        title: e.target.value,
      });
    },
    [templateDetails],
  );

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Spin tip={t('templateDetailsPage.loading')}>
          <div style={{ height: '200px' }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message={t('templateDetailsPage.errorMessage')}
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!template) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message={t('templateDetailsPage.templateNotFound')}
          type="error"
          showIcon
        />
      </div>
    );
  }
  console.log(comments);
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
        <p>
          {t('templateDetailsPage.category')}: {template.category}
        </p>
        <Button type="link" onClick={() => setShowTemplateEditForm(true)}>
          {t('templateDetailsPage.editTemplate')}
        </Button>
        <Button
          type="link"
          danger
          onClick={(event) => handleDeleteTemplate(Number(id), event)}
        >
          {t('templateDetailsPage.deleteButton')}
        </Button>
        <Button
          type="primary"
          onClick={handleStartTest}
          style={{ marginTop: '20px' }}
        >
          {t('templateDetailsPage.startTest')}
        </Button>
      </Card>

      {showTemplateEditForm && (
        <Form layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item label={t('templateDetailsPage.templateTitle')} required>
            <Input
              value={templateDetails.title}
              onChange={handleTemplateTitle}
              placeholder={t('templateDetailsPage.enterTemplateTitle')}
            />
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.description')}>
            <Input.TextArea
              value={templateDetails.description}
              onChange={(e) =>
                setTemplateDetails({
                  ...templateDetails,
                  description: e.target.value,
                })
              }
              placeholder={t('templateDetailsPage.enterDescription')}
            />
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.category')} required>
            <Input
              value={templateDetails.category}
              onChange={(e) =>
                setTemplateDetails({
                  ...templateDetails,
                  category: e.target.value,
                })
              }
              placeholder={t('templateDetailsPage.selectCategory')}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSaveTemplate}>
            {t('templateDetailsPage.saveTemplate')}
          </Button>
        </Form>
      )}

      <h3>Questions ({questions.length})</h3>
      {questions.length > 0 ? (
        <List
          dataSource={questions}
          renderItem={(question) => (
            <List.Item>
              <Card title={question.title} style={{ width: '100%' }}>
                <p>
                  {t('templateDetailsPage.questionType')} {question.type}
                </p>
                <p>
                  {t('templateDetailsPage.questionDescription')}{' '}
                  {question.description || 'No description'}
                </p>
                {question.correct_answer && (
                  <p>
                    {t('templateDetailsPage.correctAnswer')}{' '}
                    {question.correct_answer}
                  </p>
                )}
                <Button
                  type="link"
                  onClick={() => handleEditQuestion(question)}
                >
                  {t('templateDetailsPage.editButton')}
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  {t('templateDetailsPage.deleteButtonQuestion')}
                </Button>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Alert
            message={t('templateDetailsPage.noQuestions')}
            type="info"
            showIcon
          />
        </div>
      )}

      <Button
        type="primary"
        onClick={handleAddQuestionClick}
        style={{ marginBottom: '20px' }}
      >
        {t('templateDetailsPage.addQuestion')}
      </Button>
      <Button
        type="primary"
        onClick={
          isEditingQuestion ? handleSaveEditedQuestion : handleSaveQuestion
        }
      >
        {isEditingQuestion
          ? `${t('templateDetailsPage.saveEditedQuestion')}`
          : `${t('templateDetailsPage.saveQuestion')}`}
      </Button>
      {showQuestionForm && (
        <Form layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item label={t('templateDetailsPage.questionTitle')} required>
            <Input
              value={questionDetails.title}
              onChange={(e) =>
                setQuestionDetails({
                  ...questionDetails,
                  title: e.target.value,
                })
              }
              placeholder={t('templateDetailsPage.questionTitlePlaceholder')}
            />
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.questionType')} required>
            <Select
              value={questionDetails.type}
              onChange={(value) =>
                setQuestionDetails({ ...questionDetails, type: value })
              }
              placeholder={t('templateDetailsPage.questionTypePlaceholder')}
            >
              <Option value="single-line">Single Line</Option>
              <Option value="multi-line">Multi-Line</Option>
              <Option value="integer">Integer</Option>
              <Option value="checkbox">Checkbox</Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.questionDescription')}>
            <Input.TextArea
              value={questionDetails.description}
              onChange={(e) =>
                setQuestionDetails({
                  ...questionDetails,
                  description: e.target.value,
                })
              }
              placeholder={t(
                'templateDetailsPage.questionDescriptionPlaceholder',
              )}
            />
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.correctAnswer')}>
            <Input
              value={String(questionDetails.correct_answer)}
              onChange={(e) =>
                setQuestionDetails({
                  ...questionDetails,
                  correct_answer: e.target.value,
                })
              }
              placeholder={t('templateDetailsPage.correctAnswerPlaceholder')}
            />
          </Form.Item>
        </Form>
      )}

      <List
        header={<h3>Comments</h3>}
        bordered
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item
            actions={[
              <Tooltip title="Delete">
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteComment(comment.id)}
                />
              </Tooltip>,
            ]}
          >
            <strong>{comment.user?.username}</strong>: {comment.content} -{' '}
            <i>
              {comment.created_at
                ? new Date(comment.created_at).toLocaleString()
                : 'Invalid Date'}
            </i>
          </List.Item>
        )}
      />

      <Form onFinish={handleAddComment}>
        <Form.Item>
          <Input.TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Comment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default TemplateDetailsPage;
