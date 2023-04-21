import React from 'react';
import Skeleton from '@components/Skeleton';

export default function Loading() {
  return (
    <div className="upm-main-layout">
      <div className="upm-main-layout__header upm-padding--horizontal">
        <div style={{ flex: 1 }}>
          <Skeleton float="left" width="152px" height="36px" margin="6px 0" />
          <Skeleton float="right" width="400px" height="36px" margin="6px 0" />
        </div>
      </div>
      <div className="upm-main-layout__container">
        <div className="upm-main-layout__container__side upm-padding--container">
          <Skeleton height="100%" count={15} padding />
        </div>
        <div className="upm-main-layout__container__content">
          <div className="upm-flex upm-flex--column">
            <div style={{ height: '40px' }}>
              <Skeleton height="100%" width="40%" />
            </div>
            <div style={{ height: '150px' }}>
              <div
                style={{
                  float: 'left',
                  width: '50%',
                  height: '100%',
                  paddingRight: '5px'
                }}>
                <Skeleton height="100%" count={3} padding />
              </div>
              <div
                style={{
                  float: 'right',
                  width: '50%',
                  height: '100%',
                  paddingLeft: '5px'
                }}>
                <Skeleton height="100%" count={3} padding />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton height="100%" count={1} padding />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingManage() {
  return (
    <div className="upm-main-layout">
      <div className="upm-main-layout__header">
        <div style={{ flex: 1 }}>
          <Skeleton float="left" width="200px" height="45px" />
          <Skeleton float="right" width="400px" height="45px" />
        </div>
      </div>
      <div className="upm-main-layout__container">
        <div className="upm-main-layout__container__side upm-padding--container">
          <Skeleton height="100%" />
        </div>
        <div className="upm-main-layout__container__content">
          <div className="upm-flex upm-flex--column">
            <div style={{ height: '200px' }}>
              <Skeleton height="100%" />
            </div>
            <div className="upm-padding--top" style={{ flex: 1 }}>
              <Skeleton height="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
