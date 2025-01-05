import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import StatService from '../../services/statistics-service';

const { Title, Text } = Typography;

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState<{
    users: number;
    templates: number;
    forms: number;
    comments: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await StatService.statistic();
        setStatistics(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="danger">{t('statistic.statError')}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{t('statistic.title')}</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Title level={4}>{t('statistic.users')}</Title>
            <Text>{statistics.users}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Title level={4}>{t('statistic.templates')}</Title>
            <Text>{statistics.templates}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Title level={4}>{t('statistic.form')}</Title>
            <Text>{statistics.forms}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Title level={4}>{t('statistic.comments')}</Title>
            <Text>{statistics.comments}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
