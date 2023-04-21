// components/apply/cate-group/index.js
Component({

  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  properties: {
    cateInfo: {
      type: Object,
      value: {}
    },
    productId:{
      type:String,
    },


  },


  data: {

  },


  methods: {
    onItemTap: function ({
      currentTarget: {
        dataset: {
          info
        }
      }
    }) {
      let query = `parentId=${info.id}&parentType=${info.type}&productId=${this.data.productId}`;
      let url = '/pages/apply/material/index';
      switch (info.type) {
        case "cat_ocr":
          url = "/pages/apply/idcertificate/index";
          break;
        case "cat_info":
          url = "/pages/apply/material/index";
          break;
        case "cat_upload":
          url = "/pages/apply/uploadfile/index";
          break;
        case "cat_contact":
          url = "/pages/apply/contact/index";
          break;
        case "cat_special_dbr":
        case "cat_special_dzyw":
          if (info.hasSubItems) {
            url = '/pages/apply/guarantee/index';
          } else {
            url = '/pages/apply/guarantee/edit/index';
          }
          break;
        default:
          url = '/pages/apply/material/index';
      }
      wx.navigateTo({
        url: `${url}?${query}`
      });
    }
  }
})