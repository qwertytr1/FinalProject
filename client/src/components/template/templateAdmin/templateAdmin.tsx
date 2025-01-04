import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Spin, Alert, Button, Modal, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LikeOutlined, LikeFilled } from '@ant-design/icons'; // Import Ant Design icons
import TemplateService from '../../../services/templateService';
import TemplateDetailsPage from '../templateDetailsPage';
import LikeService from '../../../services/like-service';
import { Templates } from '../../../models/templates';

const { Meta } = Card;
const { confirm } = Modal;

const TemplatesPageAdmin = observer(() => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<
    Array<{
      id: number;
      title: string;
      image_url?: string;
      created_at: string;
      liked: boolean;
    }>
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
        response.data.map((template: Templates[]) => ({
          ...template,
          liked: false, // Default liked state
        })),
      );
    } catch (err) {
      setError(t('templatePage.errorMessage'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleCardClick = (templateId: number) => {
    navigate(`/templates/${templateId}`);
    setCurrentTemplateId(templateId);
  };

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

  const handleLikeTemplate = async (
    templateId: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation(); // Prevent the click from triggering navigate or card click
    const templateIndex = templates.findIndex(
      (template) => template.id === templateId,
    );
    if (templateIndex === -1) return;

    const template = templates[templateIndex];
    try {
      setLoading(true);
      if (template.liked) {
        await LikeService.likeDelete(templateId); // Unlike the template
      } else {
        await LikeService.likePost(templateId); // Like the template
      }

      // Update the liked state locally
      const updatedTemplates = [...templates];
      updatedTemplates[templateIndex] = { ...template, liked: !template.liked };
      setTemplates(updatedTemplates);
    } catch (err) {
      message.error(t('templatePage.likeError'));
    } finally {
      setLoading(false);
    }
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
                />
              }
              onClick={() => handleCardClick(template.id)}
            >
              <Meta
                title={template.title}
                description={`${t('templatePage.createdAt')}: ${new Date(template.created_at).toLocaleDateString()}`}
              />
              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <Button
                  type="link"
                  danger
                  onClick={(event) => handleDeleteTemplate(template.id, event)}
                >
                  {t('templatePage.deleteButton')}
                </Button>
                <Button
                  icon={template.liked ? <LikeFilled /> : <LikeOutlined />}
                  type={template.liked ? 'primary' : 'default'}
                  onClick={(event) => handleLikeTemplate(template.id, event)} // Passing event to stop propagation
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
});

export default TemplatesPageAdmin;
