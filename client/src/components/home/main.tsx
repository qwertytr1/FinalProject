import React, { useEffect, useState, useCallback, useContext } from 'react';
import { message, Typography } from 'antd';
import { TagCloud } from 'react-tagcloud';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import TagsService from '../../services/tagsService';
import MainService from '../../services/mainService';
import renderCarousel from './renderCarousel';
import Context from '../..';

interface Templates {
  id: number;
  title: string;
  image_url?: string;
  created_at: string;
  likes: number;
  isLiked?: boolean;
}

interface Tag {
  value: string;
  count: number;
  size: number;
}

const { Title } = Typography;

function Main() {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const [topTemplates, setTopTemplates] = useState<Templates[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [visibleCards, setVisibleCards] = useState(1);
  const [latestTemplates, setLatestTemplates] = useState<Templates[]>([]);

  const fetchTopTemplate = useCallback(async () => {
    try {
      const response = await MainService.topTemplates();
      const updatedTemplates = response.data.map((template: Templates) => ({
        ...template,
        isLiked: false,
        likes: 0,
      }));
      setTopTemplates(updatedTemplates);
      message.success('Templates fetched successfully');
    } catch (error) {
      message.error('Failed to fetch templates');
    }
  }, []);

  const fetchTagsCloud = useCallback(async () => {
    try {
      const response = await TagsService.getTagsCloud();
      setTags(response.data);
    } catch (error) {
      message.error('Failed to fetch tags');
    }
  }, []);

  const fetchLatestTemplates = useCallback(async () => {
    const response = await MainService.latestTemplate();
    setLatestTemplates(response.data);
  }, []);

  const getColor = (count: number) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFD700', '#FF33A1'];
    return colors[count % colors.length];
  };

  const updateVisibleCards = () => {
    const width = window.innerWidth;
    if (width > 1200) {
      setVisibleCards(4);
    } else if (width > 768) {
      setVisibleCards(3);
    } else if (width > 576) {
      setVisibleCards(2);
    } else {
      setVisibleCards(1);
    }
  };

  useEffect(() => {
    fetchLatestTemplates();
    fetchTopTemplate();
    fetchTagsCloud();
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, [fetchTopTemplate, fetchTagsCloud, fetchLatestTemplates]);
  const chunkedTopTemplates = [];
  for (let i = 0; i < topTemplates.length; i += visibleCards) {
    chunkedTopTemplates.push(topTemplates.slice(i, i + visibleCards));
  }

  const chunkedLatestTemplates = [];
  for (let i = 0; i < latestTemplates.length; i += visibleCards) {
    chunkedLatestTemplates.push(latestTemplates.slice(i, i + visibleCards));
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title
        level={1}
        className={store.theme}
        style={{
          textAlign: 'center',
          color: store.theme === 'dark-theme' ? '#ffffff' : '#000000',
        }}
      >
        {t('main.main')}
      </Title>
      <Title
        level={2}
        className={store.theme}
        style={{
          textAlign: 'center',
          color: store.theme === 'dark-theme' ? '#ffffff' : '#000000',
        }}
      >
        {' '}
        {t('main.topTemplate')}
      </Title>
      {renderCarousel({
        chunkedData: chunkedTopTemplates,
        currentUserId: store.user?.id || 0,
      })}

      <Title
        level={2}
        className={store.theme}
        style={{
          marginTop: '40px',
          color: store.theme === 'dark-theme' ? '#ffffff' : '#000000',
        }}
      >
        {t('main.tagCloud')}
      </Title>
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={tags}
        className={store.theme}
        renderer={(tag) => {
          return (
            <div
              key={tag.value}
              style={{
                fontSize: `${Math.max(12, Math.min(35, tag.count * 2))}px`,
                margin: '5px',
                color:
                  store.theme === 'dark-theme'
                    ? '#ffffff'
                    : getColor(tag.count),
                padding: '5px',
                backgroundColor:
                  store.theme === 'dark-theme'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '5px',
                display: 'inline-block',
                cursor: 'pointer',
              }}
            >
              {tag.value}
            </div>
          );
        }}
        onClick={(tag) => {
          store.setQuery(tag.value);
        }}
      />

      <Title
        level={2}
        style={{
          marginTop: '40px',
          color: store.theme === 'dark-theme' ? '#ffffff' : '#000000',
        }}
      >
        {t('main.latestTemplate')}
      </Title>
      {renderCarousel({
        chunkedData: chunkedLatestTemplates,
        currentUserId: store.user.id,
      })}
    </div>
  );
}

export default observer(Main);
