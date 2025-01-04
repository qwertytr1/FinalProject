import React, { useEffect, useState, useCallback, useContext } from 'react';
import { message, Typography } from 'antd';
import { TagCloud } from 'react-tagcloud';
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
  const { store } = useContext(Context);
  const [topTemplates, setTopTemplates] = useState<
    Array<{
      id: number;
      title: string;
      image_url?: string;
      created_at: string;
      likes: number;
      isLiked?: boolean;
    }>
  >([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [visibleCards, setVisibleCards] = useState(1);
  const [latestTemplates, setLatestTemplates] = useState<
    Array<{
      id: number;
      title: string;
      image_url?: string;
      created_at: string;
      likes: number;
      isLiked?: boolean;
    }>
  >([]);
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
      console.error(error);
    }
  }, []);

  const fetchTagsCloud = useCallback(async () => {
    try {
      const response = await TagsService.getTagsCloud();
      setTags(response.data);
    } catch (error) {
      message.error('Failed to fetch tags');
      console.error(error);
    }
  }, []);

  const fetchLatestTemplates = useCallback(async () => {
    try {
      const response = await MainService.latestTemplate();
      setLatestTemplates(response.data);
    } catch (e) {
      console.error(e);
    }
  }, []);
  console.log(latestTemplates);
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

  const handleComment = (id: number) => {
    message.info(`Comment feature for template ${id} is not implemented yet.`);
  };

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
      <Title level={1} style={{ textAlign: 'center' }}>
        Main
      </Title>
      <Title level={2}>Top Templates</Title>
      {renderCarousel({
        chunkedData: chunkedTopTemplates,
        onCommentClick: handleComment,
        currentUserId: store.user.id,
      })}

      <Title level={2} style={{ marginTop: '40px' }}>
        Tag Cloud
      </Title>
      <TagCloud
        minSize={12}
        maxSize={35}
        renderer={(tag) => (
          <span
            key={`${tag.value}`}
            style={{
              fontSize: `${Math.max(12, Math.min(35, tag.count * 2))}px`,
              margin: '5px',
              color: getColor(tag.count),
              padding: '5px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '5px',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            {tag.value}
          </span>
        )}
        tags={tags}
        onClick={(tag) => alert(`'${tag.value}' was selected!`)}
      />

      <Title level={2} style={{ marginTop: '40px' }}>
        Latest Template
      </Title>
      {renderCarousel({
        chunkedData: chunkedLatestTemplates,
        onCommentClick: handleComment,
        currentUserId: store.user.id,
      })}
    </div>
  );
}
export default Main;
