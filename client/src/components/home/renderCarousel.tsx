import { Carousel, Card, Row, Col } from 'antd';
import Meta from 'antd/es/card/Meta';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../like/likeButton';
import TemplateDetailsPage from '../template/templateDetailsPage';
import Context from '../..';

interface Templates {
  id: number;
  title: string;
  image_url?: string;
  created_at: string;
  likes: number;
  isLiked?: boolean;
}

interface RenderCarouselProps {
  chunkedData: Templates[][];
  currentUserId: number | undefined;
}

const RenderCarousel: React.FC<RenderCarouselProps> = ({
  chunkedData,
  currentUserId,
}) => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(
    null,
  );
  const handleCardClick = (templateId: number) => {
    if (store.isAuth) {
      navigate(`/templates/${templateId}`);
      setCurrentTemplateId(templateId);
    }
  };

  return (
    <>
      {!store.isAuth && currentTemplateId !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TemplateDetailsPage />
        </div>
      )}

      <Carousel autoplay autoplaySpeed={5000} dots={false} draggable>
        {chunkedData.map((group) => (
          <div key={group[0].id}>
            <Row gutter={[16, 16]} justify="center">
              {group.map((item) => (
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
                    onClick={() => handleCardClick(item.id)}
                    style={{ textAlign: 'center' }}
                  >
                    <Meta
                      title={item.title}
                      description={`Created At: ${new Date(
                        item.created_at,
                      ).toLocaleDateString()}`}
                    />
                    <div
                      style={{
                        marginTop: '10px',
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      <LikeButton
                        templateId={item.id}
                        initialLiked={item.isLiked ?? false}
                        currentUserId={currentUserId}
                      />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default RenderCarousel;
