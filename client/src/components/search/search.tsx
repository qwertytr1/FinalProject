import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Spin, notification, Card, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SearchService from '../../services/searchService';

const { Search } = Input;
const { Meta } = Card;

interface Template {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
}

interface Tag {
  id: number;
  value: string;
}

interface Comment {
  id: number;
  content: string;
  user?: {
    username: string;
  };
}

interface SearchResults {
  templates: Template[];
  templatesByTags: Template[];
  comments: Comment[];
  tags: Tag[];
}

const SearchTemplates = ({ searchQuery }: { searchQuery: string }) => {
  const [query, setQuery] = useState(searchQuery || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    templates: [],
    templatesByTags: [],
    comments: [],
    tags: [],
  });
  const handleSearch = useCallback(async () => {
    if (!query) {
      notification.warning({
        message: 'Пожалуйста, введите запрос для поиска.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await SearchService.search(query);
      setResults(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        notification.error({
          message: 'Ошибка при выполнении поиска',
          description: error.response
            ? error.response.data.error
            : 'Неизвестная ошибка',
        });
      } else {
        notification.error({
          message: 'Ошибка при выполнении поиска',
          description: 'Неизвестная ошибка',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch();
    }
  }, [searchQuery, handleSearch]);

  return (
    <div style={{ padding: '20px' }}>
      <Search
        placeholder="Ищите шаблоны, вопросы, комментарии или теги"
        enterButton={<SearchOutlined />}
        size="large"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
      />

      {loading && (
        <Spin size="large" style={{ display: 'block', marginTop: '20px' }} />
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Шаблоны</h3>
        <Row gutter={[16, 16]}>
          {results.templates.map((item: Template) => (
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

        <h3 style={{ marginTop: '20px' }}>Шаблоны по тегам</h3>
        <Row gutter={[16, 16]}>
          {results.templatesByTags.map((item: Template) => (
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

        <h3 style={{ marginTop: '20px' }}>Комментарии</h3>
        <Row gutter={[16, 16]}>
          {results.comments.map((item: Comment) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card hoverable style={{ textAlign: 'center' }}>
                <Meta
                  title={item.user?.username || 'Неизвестный пользователь'}
                  description={item.content}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <h3 style={{ marginTop: '20px' }}>Теги</h3>
        <Row gutter={[16, 16]}>
          {results.tags.map((item: Tag) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card hoverable style={{ textAlign: 'center' }}>
                <Meta title={item.value} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SearchTemplates;
