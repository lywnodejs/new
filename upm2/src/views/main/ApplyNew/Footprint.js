/* eslint-disable no-console */
/**
 * 前端足迹功能
 */

class Footprint {
  constructor() {
    // super();

    this.footprint = [];
    this.maxLength = 4; // 足迹个数
  }
  getData (apps) {
    let footprint = window.localStorage.getItem('FE_Footprint');
    let newfootprint = JSON.parse(footprint);

    if (footprint) {
      footprint = JSON.parse(footprint);
      if (apps && apps.length) {
        newfootprint = footprint.filter(i => {
          const j = apps.find(item => {
            return i && i.appId == item.appId;
          });
          if (j && j.isOpenApply == 2) {
            return false;
          } else {
            return true;
          }
          // for(let j = 0; j < apps.length; j ++) {
          //   if (i.appId == apps[j].appId) {
          //     console.log(apps[j]);
          //     return true;
          //   }
          // }
          // return false;
        });
        if (JSON.stringify(newfootprint) != JSON.stringify(footprint)) {
          window.localStorage.setItem('FE_Footprint', JSON.stringify(newfootprint));
        }
      }
      this.footprint = newfootprint;
    }

    return this.footprint;
  }
  setData (sysInfo) {
    let footprint = [];
    if (this.footprint.length) {
      footprint = this.footprint;
    } else {
      footprint = this.getData();
    }
    const hasSystem = footprint.find((item) => {
      // return item && sysInfo && item.appId === sysInfo.appId;
      return item.appId === sysInfo.appId;
    });
    if (!hasSystem) {
      if (footprint.length < this.maxLength) {
        footprint.unshift(sysInfo);
        footprint = JSON.stringify(footprint);
        window.localStorage.setItem('FE_Footprint', footprint);
      } else {
        this.updateData(sysInfo);
      }
    }
  }
  updateData (sysInfo) {
    let footprint = [];
    if (this.footprint.length) {
      footprint = this.footprint;
    } else {
      footprint = this.getData();
    }
    footprint.pop();
    footprint.unshift(sysInfo);
    footprint = JSON.stringify(footprint);
    window.localStorage.setItem('FE_Footprint', footprint);
  }
}

export default Footprint;