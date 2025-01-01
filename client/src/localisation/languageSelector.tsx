import { useEffect } from 'react';
import i18n from 'i18next';

const LanguageSelector = () => {
  const languageFromStorage = localStorage.getItem('language') || 'en';

  useEffect(() => {
    if (languageFromStorage) {
      i18n.changeLanguage(languageFromStorage);
    }
  }, [languageFromStorage]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  return (
    <select
      onChange={(e) => handleLanguageChange(e.target.value)}
      value={languageFromStorage}
    >
      <option value="en">English</option>
      <option value="ru">Russian</option>
      <option value="pl">Polish</option>
    </select>
  );
};
export default LanguageSelector;
