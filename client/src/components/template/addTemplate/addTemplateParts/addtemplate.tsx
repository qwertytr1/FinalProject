import React, { useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import TemplateDetails from './templateDetails';
import TemplateService from '../../../../services/templateService';
import { Templates } from '../../../../models/templates';

const CreateTemplateModal: React.FC = () => {
  const { t } = useTranslation();
  const [templateData, setTemplateData] = useState<Templates>({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    isPublic: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading] = useState(false);

  const updateTemplateData = (
    key: keyof Templates,
    value: string | boolean,
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
          templateData={templateData}
          updateTemplateData={updateTemplateData}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateTemplateModal;
