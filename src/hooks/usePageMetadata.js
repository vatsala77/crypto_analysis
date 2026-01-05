import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const usePageMetadata = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const updateMetadata = () => {
      const t = i18n.t;
      document.title = t('meta.title');
      
      const description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute('content', t('meta.description'));

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', t('meta.og:title'));

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute('content', t('meta.og:description'));
      
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute('content', t('meta.twitter:title'));

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) twitterDescription.setAttribute('content', t('meta.twitter:description'));
    };

    updateMetadata(); // Initial update
    i18n.on('languageChanged', updateMetadata);

    return () => {
      i18n.off('languageChanged', updateMetadata);
    };
  }, [i18n]);
};
