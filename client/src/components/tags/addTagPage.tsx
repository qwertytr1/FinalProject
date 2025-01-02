import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import TagsService from '../../services/tagsService';

const AddTagPage: React.FC = () => {
  const { t } = useTranslation();
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = 'admin';
      setRole(userRole);
    };

    fetchUserRole();
  }, []);

  const handleAddTag = async () => {
    if (role !== 'admin') {
      message.error(t('addTagPage.noPermissionMessage'));
      return;
    }

    if (!tagName) {
      message.error(t('addTagPage.tagRequiredMessage'));
      return;
    }

    setLoading(true);
    try {
      await TagsService.addTags(tagName);
      message.success(t('addTagPage.successMessage'));
      setTagName('');
    } catch (error) {
      message.error(t('addTagPage.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('addTagPage.title')}</h2>
      {role === 'admin' ? (
        <>
          <Input
            placeholder={t('addTagPage.placeholder')}
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            style={{ width: 300, marginBottom: 20 }}
          />
          <Button
            type="primary"
            onClick={handleAddTag}
            loading={loading}
            disabled={!tagName}
          >
            {t('addTagPage.addButton')}
          </Button>
        </>
      ) : (
        <p>{t('addTagPage.noPermissionMessage')}</p>
      )}
    </div>
  );
};

export default AddTagPage;
