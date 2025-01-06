import React, { useCallback, useContext, useEffect } from 'react';
import { Input, Spin, notification, Card, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Context from '../..';
import './search.css';

const { Search } = Input;
const { Meta } = Card;

const SearchTemplates = observer(() => {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const { results, isLoading, theme } = store;

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        await store.search(query);
      } catch (error) {
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
    <div style={{ padding: '20px' }} className={theme}>
      <Search
        placeholder={t('searchTemplates.placeholder')}
        enterButton={<SearchOutlined />}
        size="large"
        value={store.query}
        onChange={handleQueryChange}
        onSearch={handleSearch}
        className={`search-bar ${theme}`}
      />

      {isLoading && (
        <Spin size="large" style={{ display: 'block', marginTop: '20px' }} />
      )}

      {store.query && !isLoading && (
        <div style={{ marginTop: '20px' }} className={theme}>
          <h3 className={theme}>{t('searchTemplates.templates')}</h3>
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
                  className={`${theme} card-container`}
                >
                  <Meta
                    title={item.title}
                    description={`Created At: ${new Date(item.created_at).toLocaleDateString()}`}
                    className={`${theme} card-meta`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <h3 style={{ marginTop: '20px' }} className={theme}>
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
                  className={`${theme} card-container`}
                >
                  <Meta
                    title={item.title}
                    description={`Created At: ${new Date(item.created_at).toLocaleDateString()}`}
                    className={`${theme} card-meta`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <h3 style={{ marginTop: '20px' }} className={theme}>
            {t('searchTemplates.comments')}
          </h3>
          <Row gutter={[16, 16]}>
            {results.comments.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable className={`${theme} card-container`}>
                  {' '}
                  <Meta
                    title={item.user?.username || 'Unknown User'}
                    description={item.content}
                    className={`${theme} card-meta`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <h3 style={{ marginTop: '20px' }} className={theme}>
            {t('searchTemplates.tags')}
          </h3>
          <Row gutter={[16, 16]}>
            {results.tags.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable className={`${theme} card-container`}>
                  {' '}
                  <Meta
                    title={item.value}
                    className={`${theme} card-meta`}
                  />{' '}
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
