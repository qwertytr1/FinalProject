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
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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
  const hasTemplateAccess = store.user.role === 'admin' || template?.hasAccess;
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const handleDeleteTemplate = useCallback(
    async (templateId: number, event: React.MouseEvent) => {
      if (!hasTemplateAccess) {
        setError(t('templateDetailsPage.noAccessError'));
        return;
      }
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
    },
    [hasTemplateAccess, navigate, t],
  );

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
        setError(t('templateDetailsPage.errorMessage'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id, t]);

  const handleAddQuestionClick = useCallback(() => {
    setIsEditingQuestion(false);
    setQuestionDetails({
      id: 0,
      title: '',
      type: '',
      description: '',
      correct_answer: '',
    });
    setShowQuestionForm(true);
  }, []);

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

  const handleSaveQuestion = useCallback(async () => {
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
  }, [
    id,
    questionDetails.correct_answer,
    questionDetails.description,
    questionDetails.id,
    questionDetails.title,
    questionDetails.type,
    t,
  ]);

  const handleDeleteQuestion = useCallback(
    async (questionId: number) => {
      try {
        await QuestionService.deleteQuestion(Number(id), questionId);
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== questionId),
        );
      } catch (err) {
        setError(t('templateDetailsPage.errorDeleteQuestion'));
      }
    },
    [id, t],
  );

  const handleSaveEditedQuestion = useCallback(async () => {
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
  }, [
    id,
    questionDetails.correct_answer,
    questionDetails.description,
    questionDetails.id,
    questionDetails.title,
    questionDetails.type,
    t,
  ]);

  const handleEditQuestion = useCallback(
    (questionId: number) => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        setIsEditingQuestion(true);
        setQuestionDetails({
          id: question.id,
          title: question.title,
          type: question.type,
          description: question.description || '',
          correct_answer: question.correct_answer || '',
        });
        setShowQuestionForm(true);
      }
    },
    [questions],
  );
  useEffect(() => {
    const fetchComments = async () => {
      if (id) {
        try {
          const response = await CommentsService.getComment(Number(id));
          if (response.data) {
            setComments(response.data);
          } else {
            setError(t('templateDetailsPage.noCommentsFound'));
          }
        } catch (err) {
          setError(t('templateDetailsPage.failedToLoadComments'));
        }
      }
    };
    fetchComments();
  }, [id, t]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;
    const response = await CommentsService.commentPost(Number(id), newComment);
    setComments((prevComments) => [...prevComments, response.data]);
    setNewComment('');
  }, [id, newComment]);

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

    return () => clearInterval(intervalId);
  }, [id]);
  const handleDeleteComment = useCallback(async (commentId: number) => {
    try {
      await CommentsService.commentDelete(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
    } catch (err) {
      setError('Failed to delete comment.');
    }
  }, []);

  const handleSaveTemplate = useCallback(async () => {
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
  }, [
    id,
    t,
    templateDetails.category,
    templateDetails.description,
    templateDetails.title,
  ]);

  const handleStartTest = useCallback(async () => {
    if (id) {
      setLoading(true);
      setError(null);
      try {
        store.resetCounts();
        const response = await FormService.formPost(Number(id));
        store.setFormId(response.data.form.id);
        navigate(`/test/${id}`);
      } catch (err) {
        setError('Failed to load the form data.');
      } finally {
        setLoading(false);
      }
    }
  }, [id, navigate, store]);
  const handleTemplateTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemplateDetails({
        ...templateDetails,
        title: e.target.value,
      });
    },
    [templateDetails],
  );
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuestionDetails((prevDetails) => ({
        ...prevDetails,
        title: e.target.value,
      }));
    },
    [],
  );

  const handleTypeChange = useCallback((value: string) => {
    setQuestionDetails((prevDetails) => ({
      ...prevDetails,
      type: value,
    }));
  }, []);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuestionDetails((prevDetails) => ({
        ...prevDetails,
        description: e.target.value,
      }));
    },
    [],
  );

  const handleCorrectAnswerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuestionDetails((prevDetails) => ({
        ...prevDetails,
        correct_answer: e.target.value,
      }));
    },
    [],
  );
  const handleTemplateCategory = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemplateDetails({
        ...templateDetails,
        category: e.target.value,
      });
    },
    [templateDetails],
  );
  const handleTemplateDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTemplateDetails({
        ...templateDetails,
        description: e.target.value,
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
  return (
    <div style={{ padding: '20px' }}>
      <Card
        actions={[
          hasTemplateAccess && (
            <Button
              key="edit"
              onClick={() => setShowTemplateEditForm(true)}
              icon={<EditOutlined />}
            >
              {t('templateDetailsPage.editTemplate')}
            </Button>
          ),
          hasTemplateAccess && (
            <Button
              key="delete"
              onClick={(e) => handleDeleteTemplate(template?.id || 0, e)}
              icon={<DeleteOutlined />}
              danger
            >
              {t('templateDetailsPage.deleteTemplate')}
            </Button>
          ),
        ]}
        cover={
          <img
            alt={template.title}
            src={template.image_url || 'https://via.placeholder.com/300x200'}
          />
        }
      >
        <h2>{template.title}</h2>
        <p>{template.description}</p>
        <p>
          {t('templateDetailsPage.category')}: {template.category}
        </p>
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
              onChange={handleTemplateDescription}
              placeholder={t('templateDetailsPage.enterDescription')}
            />
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.category')} required>
            <Input
              value={templateDetails.category}
              onChange={handleTemplateCategory}
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
                {hasTemplateAccess && (
                  <>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditQuestion(question.id)}
                    >
                      {t('templateDetailsPage.editQuestion')}
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      {t('templateDetailsPage.deleteButtonQuestion')}
                    </Button>
                  </>
                )}
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

      {hasTemplateAccess && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddQuestionClick}
        >
          {t('templateDetailsPage.addQuestion')}
        </Button>
      )}
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
              onChange={handleTitleChange}
              placeholder={t('templateDetailsPage.questionTitlePlaceholder')}
            />
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.questionType')} required>
            <Select
              value={questionDetails.type}
              onChange={handleTypeChange}
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
              onChange={handleDescriptionChange}
              placeholder={t(
                'templateDetailsPage.questionDescriptionPlaceholder',
              )}
            />
          </Form.Item>
          <Form.Item label={t('templateDetailsPage.correctAnswer')}>
            <Input
              value={String(questionDetails.correct_answer)}
              onChange={handleCorrectAnswerChange}
              placeholder={t('templateDetailsPage.correctAnswerPlaceholder')}
            />
          </Form.Item>
        </Form>
      )}

      <List
        header={<h3>{t('templateDetailsPage.comment')}</h3>}
        bordered
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item
            actions={[
              <Tooltip title={t('templateDetailsPage.deleteComment')}>
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
                : t('templateDetailsPage.invalidDate')}
            </i>
          </List.Item>
        )}
      />

      <Form onFinish={handleAddComment}>
        <Form.Item>
          <Input.TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('templateDetailsPage.addComment')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('templateDetailsPage.addComment')}
          </Button>
        </Form.Item>
      </Form>

      {comments.length === 0 && (
        <Alert
          message={t('templateDetailsPage.noComments')}
          type="info"
          showIcon
        />
      )}
    </div>
  );
});

export default TemplateDetailsPage;
