import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Card, Row, Col, Spin, Alert, Button, Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TemplateService from '../../../services/templateService';
import TemplateDetailsPage from '../templateDetailsPage';
import { Templates, TemplateAccess } from '../../../models/templates';
import LikeButton from '../../like/likeButton';
import Context from '../../..';

const { Meta } = Card;
const { confirm } = Modal;

const TemplatesAllPage = observer(() => {
  const { store } = useContext(Context);
  const { t } = useTranslation();
  const currentUserId = store.user.id;
  const currentUserRole = store.user.role;
  const [templates, setTemplates] = useState<
    Array<Templates & { hasAccess: boolean; liked: boolean }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TemplateService.getTemplates();
      setTemplates(
        response.data.map((template: Templates) => ({
          ...template,
          liked: false,
          hasAccess:
            template.templateAccesses?.some(
              (access: TemplateAccess) => access.user.id === currentUserId,
            ) ?? false,
        })),
      );
    } catch (err) {
      setError(t('templatePage.errorMessage'));
    } finally {
      setLoading(false);
    }
  }, [t, currentUserId]);
  const handleCardClick = (templateId: number) => {
    if (store.isAuth) {
      navigate(`/templates/${templateId}`);
      setCurrentTemplateId(templateId);
    }
  };
  console.log(store.user, templates);
  const handleDeleteTemplate = async (
    templateId: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    confirm({
      title: t('templatePage.title'),
      content: t('templatePage.content'),
      okText: t('templatePage.okText'),
      okType: 'danger',
      cancelText: t('templatePage.cancelText'),
      async onOk() {
        try {
          setLoading(true);
          await TemplateService.deleteTemplate(templateId);
          setTemplates((prevTemplates) =>
            prevTemplates.filter((template) => template.id !== templateId),
          );
        } catch (err) {
          setError(t('templatePage.errorMessage'));
        } finally {
          setLoading(false);
        }
      },
    });
  };
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Spin tip={t('templatePage.spinTip')}>
          <div style={{ height: '200px' }} />
        </Spin>
      </div>
    );
  }

  if (currentTemplateId !== null) {
    return <TemplateDetailsPage />;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message={t('templatePage.errorMessage')} type="error" showIcon />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message={t('templatePage.zeroTemplates')} type="info" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {templates.map((template) => (
          <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={template.title}
                  src={
                    template.image_url ||
                    'https://via.placeholder.com/300x200?text=No+Image'
                  }
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover', // Обеспечивает правильное обрезание изображения, чтобы оно подходило
                  }}
                />
              }
              onClick={() => template.id && handleCardClick(template.id)}
              style={{ height: '400px' }} // Устанавливаем фиксированную высоту для карточки
            >
              <Meta
                title={template.title}
                description={`${t('templatePage.createdAt')}: ${new Date(template.created_at).toLocaleDateString()}`}
              />
              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                {(template.hasAccess || currentUserRole === 'admin') && (
                  <Button
                    type="link"
                    danger
                    onClick={(event) =>
                      template.id && handleDeleteTemplate(template.id, event)
                    }
                  >
                    {t('templatePage.deleteButton')}
                  </Button>
                )}
                <LikeButton
                  templateId={template.id ?? 0}
                  initialLiked={template.liked}
                  currentUserId={currentUserId}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
});

export default TemplatesAllPage;
