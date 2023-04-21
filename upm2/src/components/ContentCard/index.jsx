import React from 'react';
import './index.less';

const ContentCard = props => {
  const { title, titleButton, children, className, promptInfo } = props;

  return (
    <div className={`content-card ${className}`}>
      <div className="card-head">
        <div className="card-title">
          <div className="title-icon" />
          <div className="title-text">{title}</div>
          <div className="prompt-info">{promptInfo}</div>
        </div>
        <div className="card-button">{titleButton}</div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default ContentCard;
