import React from 'react';

import './index.less';

const CardTilte = (props = {}) => {
  return (
    <span
    className="upm-card-title"
    >{props.title}
      {props.sub ? <span className="upm-card-title__sub">{props.sub}</span> : null}
    </span>
  );
};

export default CardTilte;
