module.exports = Behavior({
  methods: {

    jump() {
      let pageStack = getCurrentPages();
      let prePage = pageStack[pageStack.length - 2];
      if (prePage.route === "pages/apply/index/index") {
        let cateGroups = prePage.data.productInfo.attrCats
        let allCats = cateGroups.reduce((preValue, curValue) => {
          curValue.subCats.forEach(item => {
            item.productId = this.data.productId;
          })
          return [...preValue, ...curValue.subCats]
        }, [])
        let curCate = allCats.find(item => item.id == this.data.parentId)
        if (curCate === undefined || curCate === null) {
          wx.navigateBack()
        } else {
          curCate.completed = true
          let nextUncomletedCat = allCats.find(item => !item.completed)
          if (nextUncomletedCat === undefined || nextUncomletedCat === null) {
            wx.navigateBack()
          } else {
            prePage.setData({
              productInfo: prePage.data.productInfo
            })
            let query = `parentId=${nextUncomletedCat.id}&parentType=${nextUncomletedCat.type}&productId=${nextUncomletedCat.productId}`;
            let url = '/pages/apply/material/index';
            switch (nextUncomletedCat.type) {
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
                if (nextUncomletedCat.hasSubItems) {
                  url = '/pages/apply/guarantee/index';
                } else {
                  url = '/pages/apply/guarantee/edit/index';
                }
                break;
              default:
                url = '/pages/apply/material/index';
            }
            wx.redirectTo({
              url: `${url}?${query}`
            });
          }
        }
      } else {
        wx.navigateBack()
      }
    },

    onClickLeft: function () {
      if (!this.data.initCompleted && this.data.editFlag) {
        if (this.data.cateInfo.detainTips) {
          this.setData({
            showStay: true
          });
        } else {
          this.onCancelStay()
        }
      } else {
        wx.navigateBack();
      }
    },

    onCancelStay: function () {
      this._saveAttrs({
        saveType: 'temp'
      });
      this.setData({
        showStay: false
      });
      wx.navigateBack();
    },
    onContinue: function () {
      this.setData({
        showStay: false
      });
    },

  }
})