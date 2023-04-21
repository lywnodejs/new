import fetch from '~/utils/fetch'
export default {
  /**
     * 
     * @param type 
     * CAT_TYPE：属性类目类型
        ATTR_TYPE：属性类型
        PRODUCT_TYPE：产品类型
        PLATFORM_TYPE：平台类型
     */
  getDictMap(type) {
    return fetch(
      'bank.api.standard.datadictionaryservice.querydictionarylist',
      [{type}],
    )
  },
  getValueByDict(value, dictMap) {
    const item = dictMap.find((v) => v.value == value)
    return (item && (item.valueName || item.name)) || ''
  },
  getBase64offile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onloadend = (e) => {
        return resolve(e.target.result.split('base64,')[1])
      }
      fileReader.readAsDataURL(file)
    })
  },
  getProductList() {
    return fetch('bank.api.standard.productservice.productlist')
  },
  getProductDetail(productId) {
    return fetch('bank.api.standard.productservice.productinfo', [{productId}])
  },
  importTemplate4pro(productId) {
    return fetch('bank.api.standard.productservice.importmodel', [{productId}])
  },
  getSelectProductList() {
    return fetch('bank.api.standard.productservice.ydqproductselectlist')
  },
  updateProductStatus(params) {
    return fetch('bank.api.standard.productservice.updateproductstatus', [
      params,
    ])
  },
  updateProductSorts(params) {
    return fetch('bank.api.standard.productservice.saveproductorder', [
      {productOrderList: params},
    ])
  },
  uploadImg(base64) {
    return fetch('bank.api.standard.fileservice.uploadbase64image', [
      {imageBase64: base64},
    ])
  },
  ImgUpload(base64) {
    return fetch('bank.api.activityservice.uploadimg', [
      {imgData: base64, imgType: 'png'},
    ])
  },
  changeProduct(params) {
    return fetch('bank.api.standard.productservice.upsertproduct', [params])
  },
  getProductData(id) {
    return fetch('bank.api.standard.productservice.productinfo', [{id}])
  },
  changeAttr(params) {
    return fetch('bank.api.standard.productservice.upsertattr', [params])
  },
  getAttrsCategory(params) {
    return fetch('bank.api.standard.modelattrservice.modelattrselect', [params])
  },
  getProductAttrs(params) {
    return fetch('bank.api.standard.productservice.productattrlist', [params])
  },
  deleteProAttr(id) {
    return fetch('bank.api.standard.productservice.deleteattr', [{id}])
  },
  getLinkageByProId(productId) {
    return fetch('bank.api.standard.productservice.relationattrselect', [
      {productId},
    ])
  },
  getAttrDetail(params) {
    return fetch('bank.api.standard.modelattrservice.attrdetail', [params])
  },
  updateProductAttrSorts(params) {
    return fetch('bank.api.standard.productservice.saveattrorder', params)
  },
  getAttrLib(params) {
    return fetch('bank.api.standard.modelattrservice.querymodelattrlist', [
      params,
    ])
  },
  getAttrsDict() {
    return fetch('bank.api.standard.datadictionaryservice.attrtypes')
  },
  getValidateList() {
    return fetch('bank.api.standard.productservice.modelvalidatelist')
  },
  changeLibAttr(params) {
    return fetch('bank.api.standard.modelattrservice.upsertbasicattr', [params])
  },
  getLinkageByProType(productType) {
    return fetch('bank.api.standard.modelattrservice.modelrelationattrselect', [
      {productType},
    ])
  },
  changeTemplateAttr(params) {
    return fetch('bank.api.standard.modelattrservice.upsertmodelattr', [params])
  },
  deleteTemplateAttr(id) {
    return fetch('bank.api.standard.modelattrservice.deletemodelattr', [{id}])
  },
  getPro4userList() {
    return fetch('bank.api.standard.crowdservice.productlist')
  },
  getWhiteBlackList(params) {
    return fetch('bank.api.standard.crowdservice.searchcrowd', [params])
  },
  uploadWhiteBlackData(params) {
    return fetch('bank.api.standard.crowdservice.uploadcrowd', [params])
  },
  // TODO
  getWhiteBlackData(id) {
    return fetch('bank.api.standard.crowdservice.detail', [{id}])
  },
  deleteWhiteBlackItem(id) {
    return fetch('bank.api.standard.crowdservice.deletecrowd', [{id}])
  },
}
