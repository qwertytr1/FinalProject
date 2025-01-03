import { Carousel, Card, Button, Row, Col } from 'antd';
import { HeartOutlined, CommentOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';

interface Templates {
  id: number;
  title: string;
  image_url?: string;
  created_at: string;
  likes: number;
  isLiked?: boolean;
}
const renderCarousel = (
  chunkedData: Templates[][],
  onCommentClick: (id: number) => void,
) => {
  return (
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
                    <Button type="text" icon={<HeartOutlined />}>
                      {item.likes || 0}
                    </Button>
                    <Button
                      type="text"
                      icon={<CommentOutlined />}
                      onClick={() => onCommentClick(item.id)}
                    >
                      Comments
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Carousel>
  );
};
export default renderCarousel;
