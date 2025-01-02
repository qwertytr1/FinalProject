import React from 'react';
import { Form, Input, Button, Select, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { Templates } from '../../../../models/templates';

interface TemplateDetailsInt {
  templateData: {
    title: string;
    description: string;
    category: string;
    isPublic: boolean;
    tags?: number[] | undefined;
  };
  updateTemplateData: (
    key: keyof Templates,
    value: string | boolean | number[],
  ) => void;
  handleImageUpload: (file: File) => boolean;
  handleSubmit: () => void;
  loading: boolean;
  tags: { id: number; value: string }[];
}

const TemplateDetails: React.FC<TemplateDetailsInt> = ({
  templateData,
  updateTemplateData,
  handleImageUpload,
  handleSubmit,
  loading,
  tags,
}) => {
  const { t } = useTranslation();
  console.log(templateData.tags, tags);
  return (
    <Form layout="vertical">
      <Form.Item label={t('templateDetails.title')}>
        <Input
          value={templateData.title}
          onChange={(e) => updateTemplateData('title', e.target.value)}
        />
      </Form.Item>
      <Form.Item label={t('templateDetails.description')}>
        <Input.TextArea
          value={templateData.description}
          onChange={(e) => updateTemplateData('description', e.target.value)}
        />
      </Form.Item>
      <Form.Item label={t('templateDetails.category')}>
        <Select
          value={templateData.category}
          onChange={(value) => updateTemplateData('category', value)}
        >
          <Select.Option value="mathematics">
            {t('templateDetails.mathematics')}
          </Select.Option>
          <Select.Option value="physics">
            {t('templateDetails.physics')}
          </Select.Option>
          <Select.Option value="chemistry">
            {t('templateDetails.chemistry')}
          </Select.Option>
          <Select.Option value="biology">
            {t('templateDetails.biology')}
          </Select.Option>
          <Select.Option value="history">
            {t('templateDetails.history')}
          </Select.Option>
          <Select.Option value="geography">
            {t('templateDetails.geography')}
          </Select.Option>
          <Select.Option value="literature">
            {t('templateDetails.literature')}
          </Select.Option>
          <Select.Option value="computer_science">
            {t('templateDetails.computerScience')}
          </Select.Option>
          <Select.Option value="foreign_languages">
            {t('templateDetails.foreignLanguages')}
          </Select.Option>
          <Select.Option value="art">{t('templateDetails.art')}</Select.Option>
          <Select.Option value="music">
            {t('templateDetails.music')}
          </Select.Option>
          <Select.Option value="philosophy">
            {t('templateDetails.philosophy')}
          </Select.Option>
          <Select.Option value="economics">
            {t('templateDetails.economics')}
          </Select.Option>
          <Select.Option value="psychology">
            {t('templateDetails.psychology')}
          </Select.Option>
          <Select.Option value="travel">
            {t('templateDetails.travel')}
          </Select.Option>
          <Select.Option value="cars">
            {t('templateDetails.cars')}
          </Select.Option>
          <Select.Option value="sports">
            {t('templateDetails.sports')}
          </Select.Option>
          <Select.Option value="health">
            {t('templateDetails.health')}
          </Select.Option>
          <Select.Option value="technology">
            {t('templateDetails.technology')}
          </Select.Option>
          <Select.Option value="programming">
            {t('templateDetails.programming')}
          </Select.Option>
          <Select.Option value="fashion">
            {t('templateDetails.fashion')}
          </Select.Option>
          <Select.Option value="cooking">
            {t('templateDetails.cooking')}
          </Select.Option>
          <Select.Option value="gaming">
            {t('templateDetails.gaming')}
          </Select.Option>
          <Select.Option value="science_fiction">
            {t('templateDetails.scienceFiction')}
          </Select.Option>
          <Select.Option value="environment">
            {t('templateDetails.environment')}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label={t('templateDetails.image')}>
        <Upload beforeUpload={handleImageUpload} maxCount={1} name="image">
          <Button loading={loading}>{t('templateDetails.ButtonImage')}</Button>
        </Upload>
      </Form.Item>
      <Form.Item label={t('templateDetails.selectTags')}>
        <Select
          mode="multiple"
          value={templateData.tags} // Передаем массив ID тегов
          onChange={(ids: number[]) => {
            updateTemplateData('tags', ids); // Передаем массив ID тегов
          }}
          placeholder={t('templateDetails.selectTags')}
        >
          {tags.map((tag) => (
            <Select.Option key={tag.id} value={tag.id}>
              {tag.value} {/* Отображаем значение тега, но передаем его ID */}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t('templateDetails.makePublic')}>
        <Select
          value={templateData.isPublic ? 'Yes' : 'No'}
          onChange={(value) => updateTemplateData('isPublic', value === 'Yes')}
        >
          <Select.Option value="Yes">{t('Yes')}</Select.Option>
          <Select.Option value="No">{t('No')}</Select.Option>
        </Select>
      </Form.Item>
      <Button type="primary" onClick={handleSubmit}>
        {t('templateDetails.nextButton')}
      </Button>
    </Form>
  );
};

export default TemplateDetails;
