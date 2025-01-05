import React, { useCallback, useContext, useEffect } from 'react';
import { Input, Spin, notification, Card, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';
import { useTranslation } from 'react-i18next';
import Context from '../..';

const { Search } = Input;
const { Meta } = Card;

const SearchTemplates = observer(() => {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const { results, isLoading } = store;
  const handleSearch = useCallback(
    async (query: string) => {
      try {
        await store.search(query);
      } catch (error) {
        console.error('Error during search:', error);
        notification.error({
          message: t('searchTemplates.errorMessage'),
        });
      }
    },
    [store, t],
  );

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.setQuery(e.target.value);
    },
    [store],
  );

  useEffect(() => {
    autorun(() => {
      console.log('Current query:', store.query);
    });
  }, [store]);

  useEffect(() => {
    if (store.query) {
      handleSearch(store.query);
    } else {
      store.results = {
        templates: [],
        templatesByTags: [],
        comments: [],
        tags: [],
      };
    }
  }, [handleSearch, store, store.query]);

  return (
    <div style={{ padding: '20px' }}>
      <Search
        placeholder={t('searchTemplates.placeholder')}
        enterButton={<SearchOutlined />}
        size="large"
        value={store.query}
        onChange={handleQueryChange}
        onSearch={handleSearch}
      />

      {isLoading && (
        <Spin size="large" style={{ display: 'block', marginTop: '20px' }} />
      )}

      {store.query && !isLoading && (
        <div style={{ marginTop: '20px' }}>
          <h3>{t('searchTemplates.templates')}</h3>
          <Row gutter={[16, 16]}>
            {results.templates.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.title}
                      src={
                        item.image_url ||
                        'https://via.placeholder.com/400x250?text=No+Image'
                      }
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  }
                  style={{ textAlign: 'center' }}
                >
                  <Meta
                    title={item.title}
                    description={`Created At: ${new Date(item.created_at).toLocaleDateString()}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <h3 style={{ marginTop: '20px' }}>
            {t('searchTemplates.templatesByTags')}
          </h3>
          <Row gutter={[16, 16]}>
            {results.templatesByTags.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.title}
                      src={
                        item.image_url ||
                        'https://via.placeholder.com/400x250?text=No+Image'
                      }
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  }
                  style={{ textAlign: 'center' }}
                >
                  <Meta
                    title={item.title}
                    description={`Created At: ${new Date(item.created_at).toLocaleDateString()}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <h3 style={{ marginTop: '20px' }}>{t('searchTemplates.comments')}</h3>
          <Row gutter={[16, 16]}>
            {results.comments.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable style={{ textAlign: 'center' }}>
                  <Meta
                    title={item.user?.username || 'Unknown User'}
                    description={item.content}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <h3 style={{ marginTop: '20px' }}>{t('searchTemplates.tags')}</h3>
          <Row gutter={[16, 16]}>
            {results.tags.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable style={{ textAlign: 'center' }}>
                  <Meta title={item.value} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
});

export default SearchTemplates;
