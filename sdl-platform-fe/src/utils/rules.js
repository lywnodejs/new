/**
 * 不能为空
 * @type {RegExp}
 */
export let emptyReg = /^\s+|\s+$/g
export let empty = (rule, value, callback) => {
  value.replace(emptyReg, '') ? callback() : callback(new Error('内容不能为空'))
}

function ignoreEmpty(ruleFn) {
  return function(rule, value, callback) {
    if (typeof value !== 'string') return callback()
    value.replace(emptyReg, '') ? ruleFn(rule, value, callback) : callback()
  }
}

/**
 * ipv4
 * @param  {[type]} (25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.|$) [description]
 * @return {[type]}                                             [description]
 */
export let ipv4Reg = /^\s*(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}\s*$/
export let ipv4 = (rule, value, callback) => {
  ipv4Reg.test(value) ? callback() : callback(new Error('请输入正确的IP'))
}

/**
 * ipv4 和 ipv4段
 * @param 默认ip分割符合divide=',' 默认ip段关联符号relate='-'
 * @return {[type]}
 */
export let ipv4Seg = ({divide = ',', relate = '-', ...rule}, value, callback) => {
  let ips = value.split(divide).reduce((o, ip) => o.concat(ip.split(relate)), [])
  let unvalid = ips.some(ip => !ipv4Reg.test(ip))
  !unvalid ? callback() : callback(new Error(`请输入正确的IP或IP段，使用${divide}分隔，使用${relate}连接IP段`))
}

/**
 * [telephoneReg description]
 * @type {RegExp}
 */
export let telephoneReg = /^(((?:400|800)([^\d]+)?\d{1,7}([^\d]+\d{1,6})?)|(((\d{4}|\d{3})(-| )?)?(\d{7,8})([^\d]+?\d{1,9})?))$/
export let telephone = ignoreEmpty((rule, value, callback) => {
  telephoneReg.test(value) ? callback() : callback(new Error('请输入正确的座机号码'))
})

/**
 * [mobileReg description]
 * @type {RegExp}
 */
export let mobileReg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
export let mobile = ignoreEmpty((rule, value, callback) => {
  mobileReg.test(value) ? callback() : callback(new Error('请输入正确的手机号码'))
})

/**
 * [phone description]
 * @type {RegExp}
 */
export let phoneReg = /^(((?:400|800)([^\d]+)?\d{1,7}([^\d]+\d{1,6})?)|(((\d{4}|\d{3})(-| )?)?(\d{7,8})([^\d]+?\d{1,9})?)|(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}))$/
export let phone = ignoreEmpty((rule, value, callback) => {
  phoneReg.test(value) ? callback() : callback(new Error('请输入正确的座机或手机号码'))
})

/**
 * [longitude description]
 * @type {[type]}
 */
export let longitudeReg = /^[-+]?(0?\d{1,2}(\.\d*)?|1[0-7]?\d{1}(\.\d*)?|180(\.0*)?)$/
export let longitude = ignoreEmpty((rule, value, callback) => {
  longitudeReg.test(Number(value)) ? callback() : callback(new Error('请输入正确的经度'))
})

/**
 * [latitude description]
 * @type {[type]}
 */
export let latitudeReg = /^[-+]?([0-8]?\d{1}(\.\d*)?|90(\.0*)?)$/
export let latitude = ignoreEmpty((rule, value, callback) => {
  latitudeReg.test(Number(value)) ? callback() : callback(new Error('请输入正确的纬度'))
})

/**
 * [domainReg description]
 * @type {RegExp}
 */
export let domainReg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
export let domain = ignoreEmpty((rule, value, callback) => {
  domainReg.test(value) ? callback() : callback(new Error('请输入正确的域名'))
})

/**
 * [ICPBeiReg description]
 * @type {RegExp}
 */
export let ICPBeiReg = /^[皖|京|渝|闽|粤|陇|桂|黔|豫|鄂|冀|琼|黑|湘|吉|苏|赣|辽|蒙|宁|青|蜀|鲁|沪|陕|晋|津|新|藏|滇|浙]ICP备\d{8}号?(-?\d+)?$/i
export let ICPBei = ignoreEmpty((rule, value, callback) => {
  ICPBeiReg.test(value) ? callback() : callback(new Error('请输入正确的ICP备案号'))
})

/**
 * [ICPZhengReg description]
 * @type {RegExp}
 */
export let ICPZhengReg = /^[皖|京|渝|闽|粤|陇|桂|黔|豫|鄂|冀|琼|黑|湘|吉|苏|赣|辽|蒙|宁|青|蜀|鲁|沪|陕|晋|津|新|藏|滇|浙]ICP证\d{6,8}号?(-?\d+)?$/i
export let ICPZheng = ignoreEmpty((rule, value, callback) => {
  ICPZhengReg.test(value) ? callback() : callback(new Error('请输入正确的ICP经营许可证号'))
})

/**
 * [ICPBeiZhengReg description]
 * @type {RegExp}
 */
export let ICPBeiZhengReg = /^[皖|京|渝|闽|粤|陇|桂|黔|豫|鄂|冀|琼|黑|湘|吉|苏|赣|辽|蒙|宁|青|蜀|鲁|沪|陕|晋|津|新|藏|滇|浙]ICP[备证]\d{6,8}号?(-?\d+)?$/i
export let ICPBeiZheng = ignoreEmpty((rule, value, callback) => {
  ICPBeiZhengReg.test(value) ? callback() : callback(new Error('请输入正确的ICP备案号或经营许可证号'))
})

/**
 * [email description]
 * @type {RegExp}
 */
export let emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
export let email = ignoreEmpty((rule, value, callback) => {
  emailReg.test(value) ? callback() : callback(new Error('请输入正确的邮箱地址'))
})
