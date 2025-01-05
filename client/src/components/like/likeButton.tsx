import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import LikeService from '../../services/like-service';

interface LikeButtonProps {
  templateId: number;
  initialLiked: boolean;
  currentUserId: number | undefined;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  templateId,
  initialLiked,
  currentUserId,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await LikeService.getLike(templateId);
        setLikeCount(response.data.likes);
        const userHasLiked = response.data.users.some(
          (user: { userId: number }) => user.userId === currentUserId,
        );
        setLiked(userHasLiked);
      } catch (err) {
        message.error('Failed to fetch like count.');
      }
    };

    fetchLikeCount();
  }, [templateId, currentUserId]);

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setLoading(true);
    try {
      if (liked) {
        await LikeService.likeDelete(templateId);
        setLikeCount((prev) => prev - 1);
        message.success('Template unliked!');
      } else {
        await LikeService.likePost(templateId);
        setLikeCount((prev) => prev + 1);
        message.success('Template liked!');
      }
      setLiked(!liked);
    } catch (err) {
      message.error('Error toggling like.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      icon={liked ? <LikeFilled /> : <LikeOutlined />}
      type={liked ? 'primary' : 'default'}
      loading={loading}
      onClick={handleLike}
      style={{ marginLeft: '8px' }}
    >
      {likeCount} {/* Отображение количества лайков */}
    </Button>
  );
};

export default LikeButton;
