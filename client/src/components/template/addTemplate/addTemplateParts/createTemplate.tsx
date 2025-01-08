import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import TemplateDetails from './templateDetails';
import TemplateService from '../../../../services/templateService';
import { TemplatesUser } from '../../../../models/templates';
import TagsService from '../../../../services/tagsService';

const CreateTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [templateData, setTemplateData] = useState<TemplatesUser>({
    title: '',
    description: '',
    category: '',
    image_url: '',
    isPublic: false,
    tags: [],
    created_at: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<{ id: number; value: string }[]>([]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await TagsService.getTags();
        const formattedTags = response.data.map(
          (tag: { id: number; value: string }) => ({
            id: tag.id,
            value: tag.value,
          }),
        );
        setTags(formattedTags);
      } catch (error) {
        message.error(t('addTemplates.errorFetchingTags'));
      }
    };

    fetchTags();
  }, [t]);
  const updateTemplateData = (
    key: keyof TemplatesUser,
    value: string | boolean | number[],
  ) => {
    setTemplateData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    return false;
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', templateData.title);
      formData.append('description', templateData.description);
      formData.append('category', templateData.category);
      formData.append('is_public', templateData.isPublic.toString());
      if (templateData.tags && templateData.tags.length > 0) {
        formData.append('tags', templateData.tags.join(','));
      } else {
        formData.append('tags', '');
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await TemplateService.addTemplate(formData);
      message.success(t('addTemplates.successMessage'));
    } catch (error) {
      message.error(t('addTemplates.errorMessage'));
    }
  };
  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('addTemplates.title')}</h1>
      <div style={{ marginTop: 20 }}>
        <TemplateDetails
          templateData={{
            ...templateData,
            tags: templateData.tags?.map((tag) => parseInt(tag, 10)),
          }}
          updateTemplateData={updateTemplateData}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          tags={tags}
        />
      </div>
    </div>
  );
};

export default CreateTemplate;
