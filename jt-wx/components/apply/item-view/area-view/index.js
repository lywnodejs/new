
// components/apply/item-view/area-view/index.js
const fetch = require("../../../../utils/fetch.js");
const place_holder = '请选择'
const app = getApp()

Component({

  properties: {
    attribute: {
      type: Object,
      value: {}
    },
  },

  options: {
    styleIsolation: 'shared',
  },


  data: {
    showSelectPopup: false,
    tabs: [place_holder],
    activeTabIndex: 0,
  },

  methods: {
    onClick(e) {
      this._getArea();
    },

    onClose(e) {
      this.setData({
        showSelectPopup: false,
      })
    },

    onTabClick({
      detail: {
        index
      }
    }) {
      let tabDataMap = this.data.tabDataMap,
        tabSelectIdMap = this.data.tabSelectIdMap,
        tabSelectIndexMap = this.data.tabSelectIndexMap,
        activeTabIndex = index,
        tabs = this.data.tabs;

      let length = tabs.length;
      let lastIndex = length - 1;
      if (activeTabIndex < lastIndex &&
        tabs[lastIndex] === place_holder) {
        delete tabDataMap[lastIndex];
        delete tabSelectIdMap[lastIndex];
        delete tabSelectIndexMap[lastIndex];
        delete tabs[lastIndex];
      }

      this.setData({
        tabDataMap,
        tabSelectIdMap,
        tabSelectIndexMap,
        activeTabIndex,
        tabs,
      })
    },

    onAreaItemTap({
      target: {
        dataset: {
          index,
          value: {
            area_name: name,
            area_id: curId,
            child_area: children
          }
        }
      }
    }) {
      let tabIndex = this.data.activeTabIndex;
      let tabDataMap = this.data.tabDataMap,
        tabSelectIdMap = this.data.tabSelectIdMap,
        tabSelectIndexMap = this.data.tabSelectIndexMap,
        activeTabIndex = this.data.activeTabIndex,
        tabs = this.data.tabs;

      let lastId = tabSelectIdMap[tabIndex];

      tabSelectIdMap[tabIndex] = curId;
      tabSelectIndexMap[tabIndex] = index;
      tabs[tabIndex] = name;

      let lastSize = tabs.length;
      for (let i = lastSize; i > tabIndex + 1; i--) {
        let preIndex = i - 1;
        if (tabSelectIdMap[preIndex] !== null && tabSelectIdMap[preIndex] !== undefined && tabSelectIdMap[preIndex] !== '' && lastId === curId) {
          continue;
        }
        delete tabDataMap[preIndex];
        delete tabSelectIdMap[preIndex];
        delete tabSelectIndexMap[preIndex];
        delete tabs[preIndex];
      }

      if (children !== null && children !== undefined) {
        let nextTabIndex = tabIndex + 1;
        if (tabSelectIdMap[nextTabIndex] === null || tabSelectIdMap[nextTabIndex] === undefined || tabSelectIdMap[nextTabIndex] === "") {
          tabs[nextTabIndex] = place_holder;
          tabDataMap[nextTabIndex] = children;
        }
        activeTabIndex = nextTabIndex;
        this.setData({
          tabDataMap,
          tabSelectIdMap,
          tabSelectIndexMap,
          activeTabIndex,
          tabs,
        })
      } else {
        this.setData({
          showSelectPopup: false,
        })
        let selectArea = tabs.join(',');
        this.triggerEvent('valuechange', {
          value: selectArea,
          showValue: selectArea,
          id: this.data.attribute.id,
          completed: true,
        });
      }
    },

    async _getArea() {
      if (app.globalData.areas !== undefined && app.globalData.areas.length > 0) {
        this._processData(app.globalData.areas);
      } else {
        const {
          code,
          data: {
            area: areas
          }
        } = await fetch(
          "bank.api.read.basereadservice.baseinfo"
        );
        if (code == 0) {
          app.globalData.areas = areas;
          this._processData(areas)
        }
      }
    },

    _processData(areas) {
      let tabDataMap = {},
        tabSelectIdMap = {},
        tabSelectIndexMap = {},
        activeTabIndex = 0,
        tabs = [];

      let attribute = this.data.attribute;
      let initValue = attribute.value;

      if (initValue === '' || initValue === undefined || initValue === null) {
        tabs = [place_holder];
        activeTabIndex = 0;
        tabDataMap[0] = areas;
      } else {
        tabs = initValue.split(',')
        activeTabIndex = tabs.length - 1;
        let subAreas = areas;
        for (const i in tabs) {
          let name = tabs[i];
          for (const j in subAreas) {
            let item = subAreas[j];
            if (name === item.area_name) {
              tabDataMap[i] = subAreas;
              tabSelectIdMap[i] = item.area_id;
              tabSelectIndexMap[i] = j;
              subAreas = item.child_area;
              break;
            }
          }
        }
      }

      this.setData({
        showSelectPopup: true,
        tabDataMap,
        tabSelectIdMap,
        tabSelectIndexMap,
        activeTabIndex,
        tabs,
      })
    }
  }
})