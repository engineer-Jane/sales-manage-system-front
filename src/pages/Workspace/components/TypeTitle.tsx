import React from 'react';
import titleBg from '@/asserts/images/title_bg.svg';

interface TypeTitleProps {
  title: string;
}

const TypeTitle: React.FC<TypeTitleProps> = (props) => {
  const { title } = props;

  return (
    <p style={{
      borderBottom: '4px solid rgba(48, 65, 86, 1)',
      display: 'flex',
    }}>
      <span style={{
        width: '198px',
        height: '38px',
        lineHeight: '38px',
        textAlign: 'center',
        background: `url(${titleBg})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '16px'
      }}>{title}</span>
    </p>
  );
};

export default TypeTitle;