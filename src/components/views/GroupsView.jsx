import { useTranslation } from 'react-i18next';

export default function GroupsView() {
  const { t } = useTranslation();
  return (
    <div className="p-12 text-center opacity-40">
      <i className="fas fa-layer-group text-5xl mb-4"></i>
      <p>{t('groupsComingSoon')}</p>
    </div>
  );
}

