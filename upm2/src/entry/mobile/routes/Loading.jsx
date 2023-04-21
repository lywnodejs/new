import React from 'react';

export default function Loading() {
  return (
    <div className="upm-mobile-loading">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '420px',
          height: '100%'
        }}
      >
        <div className="page-loading-warp">
          <div className="ant-spin ant-spin-lg ant-spin-spinning">
            <span className="ant-spin-dot ant-spin-dot-spin"
              ><i className="ant-spin-dot-item"></i><i className="ant-spin-dot-item"></i
              ><i className="ant-spin-dot-item"></i><i className="ant-spin-dot-item"></i
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}