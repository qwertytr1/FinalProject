import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Spin, Alert } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Context from '../../..';
import TemplateService from '../../../services/templateService';
import TemplateDetailsPage from '../templateDetailsPage';

const { Meta } = Card;

const TemplatesPage = observer(() => {
  const [templates, setTemplates] = useState<
    Array<{ id: number; title: string; image_url?: string; created_at: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { store } = useContext(Context);
  const userId = store.user.id;
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TemplateService.getAllTemplatesByUsers(userId);
      setTemplates(response.data);
    } catch (err) {
      setError('Failed to load templates.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleCardClick = (templateId: number) => {
    navigate(`/templates/${templateId}`);
    setCurrentTemplateId(templateId);
  };

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Spin tip="Loading templates...">
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
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="No templates found." type="info" showIcon />
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
              onClick={() => {
                handleCardClick(template.id);
              }}
            >
              <Meta
                title={template.title}
                description={`Created: ${new Date(template.created_at).toLocaleDateString()}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
});

export default TemplatesPage;
