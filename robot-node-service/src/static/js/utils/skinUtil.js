
// 皮肤映射类 赵波 2019.11.22
module.exports = {

  /**
   * 将中文样式名转换为对应的英文样式名
   * @param name
   * @returns {string}
   */
  getSkinByName (name) {
    let s = '';
    switch (name) {
      case '默认':
        s = '';
        break;
      case '蓝色':
        s = 'skin_blue';
        break;
      case '红色':
        s = 'skin_red';
        break;
      case '黑色':
        s = 'skin_black';
        break;
      case '橙色':
        s = 'skin_orange';
        break;
      case '金色':
        s = 'skin_golden';
        break;
      case '紫色':
        s = 'skin_violet';
        break;
      case '粉色':
        s = 'skin_pink';
        break;
      case '灰色':
        s = 'skin_gray';
        break;
      default:
        s = '';
        break;
    }
    return s
  },
};
