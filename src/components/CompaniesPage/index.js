import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../layout';
import { BodyText } from '../BodyText/BodyText';
import { CompaniesBanner } from '../CompaniesBanner/CompaniesBanner';
import { DeveloperStory } from '../DeveloperStory/DeveloperStory';
import Element from '../Element/Element';
import SEO from '../seo';
import mainSEOtags from '../../content/seo/mainSEOtags';
import stories from '../../content/pages/stories.json';

const CompaniesPage = ({ lang, title, seoDescription }) => {
  const { t } = useTranslation();
  const langStories = stories[lang] || [];

  return (
    <Layout>
      <SEO
        lang={lang}
        title={title}
        description={seoDescription}
        keywords={[
          ...mainSEOtags,
          'houston',
          'houston inc',
          'software development',
          'frontend',
          'elisa',
          'terveystalo',
          'konecranes',
          'k-ryhmä',
          'unity technologies',
          'unity',
          'kesko',
          'sympa',
          'funktionaalinen ohjelmointi',
          'functional programming',
          'mikropalveluarkkitehtuuri',
          'micro service architecture',
          'micro service',
        ]}
      />

      <Element className="container">
        <BodyText
          className="col-10 spacing"
          heading={{
            title: t('companiesPage:acknowledge'),
            level: 'h1',
          }}
        />

        {t('companiesPage:thanks_to')}
        <Element className="spacing--after-small" />
        {t('companiesPage:helsinki')}
        <Element className="spacing--after-small" />
        {t('companiesPage:houston')}

        <BodyText
          className="col-10 spacing"
          heading={{
            title: t('companiesPage:special_thanks'),
            level: 'h1',
          }}
        />

        <CompaniesBanner lang={lang} />

        <BodyText
          className="col-10 spacing"
          heading={{
            title: t('companiesPage:storiesTitle'),
            level: 'h1',
          }}
        />

        {langStories.map(story => (
          <DeveloperStory key={story.name} {...story} lang={lang} />
        ))}

        <Element className="spacing" />
      </Element>
    </Layout>
  );
};

export default CompaniesPage;
