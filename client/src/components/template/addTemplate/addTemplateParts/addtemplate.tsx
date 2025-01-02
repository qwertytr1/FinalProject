import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import TemplateDetails from './templateDetails';
import TemplateService from '../../../../services/templateService';
import { Templates } from '../../../../models/templates';
import TagsService from '../../../../services/tagsService'; // добавляем сервис для получения тэгов

const CreateTemplateModal: React.FC = () => {
  const { t } = useTranslation();
  const [templateData, setTemplateData] = useState<Templates>({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    isPublic: false,
    tags: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading] = useState(false);
  const [tags, setTags] = useState<{ id: number; value: string }[]>([]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await TagsService.getTags();
        // Обновляем теги как массив объектов с полями id и value
        const formattedTags = response.data.map(
          (tag: { id: number; value: string }) => ({
            id: tag.id, // Используем id как уникальный ключ
            value: tag.value, // Значение тега будет строкой
          }),
        );
        setTags(formattedTags);
      } catch (error) {
        message.error(t('addTemplates.errorFetchingTags'));
        console.error(error);
      }
    };

    fetchTags();
  }, [t]);
  const updateTemplateData = (
    key: keyof Templates,
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

      // Обработка тэгов с проверкой на undefined
      if (templateData.tags && templateData.tags.length > 0) {
        formData.append('tags', templateData.tags.join(',')); // добавляем тэги
      } else {
        formData.append('tags', ''); // если нет тегов, передаем пустую строку
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await TemplateService.addTemplate(formData);
      message.success(t('addTemplates.successMessage'));
    } catch (error) {
      console.error(error);
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
          loading={loading}
          tags={tags} // передаем теги
        />
      </div>
    </div>
  );
};

export default CreateTemplateModal;
