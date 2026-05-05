import React from 'react';

interface FontTitleProps {
  /** 标题名称 */
  title: string;
}

const FontTitle: React.FC<FontTitleProps> = (props) => {
  const { title } = props;

  return (
    <h2 style={{
      fontSize: 16,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      margin: '16px 0'
    }}>
      <span style={{
        width: 4,
        height: 18,
        background: '#1890ff',
        marginRight: 12,
      }}> </span>
      {title}
    </h2>
  )
}

export default FontTitle;