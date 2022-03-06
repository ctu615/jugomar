import React from 'react';

import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome to JugoMar Nourishing Nutritionals',
  description: 'We sell the best supplements at affordable prices',
  keywords: 'Nutrition, buy nutritional supplements, cheap supplements',
};
export default Meta;
