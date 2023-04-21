/**
 * Created by yfan on 18/2/5.
 */
import _ from 'underscore'
import URI from 'urijs'
import axios from 'axios'

let logger = require('../utils/logger')

/**
 * 实现标准接口的nodejs httpClient类，将request库请求封装为Promise对象，并提供入参过滤、统一前缀、json解析等统一设置
 * @param {String}  urlPrefix     url统一前缀
 * @param {Object}  paramsFilters  实现filterParams方法的对象
 * @constructor
 */
class ClientAxios {
  constructor(urlPrefix, commonParams) {
    this.urlPrefix = urlPrefix;
    this.commonParams = commonParams;
    this.instance = null;
  }

  /**
   * @description 根据入参生成请求信息，并根据配置增加统一前缀、过滤参数及其他统一处理
   * @param {String|Object} options url或初始请求信息
   * @param {String} method <GET|POST>
   * @param {String} params 请求参数
   * @returns {Object} 处理后最终的http请求信息
   */
  getOptions = function (options, method, params) {
    params = params || {};
    let result = options || {};
    // 如果是get请求,为了简化参数,options可以只是个url字符串,这里统一为对象格式
    if (_.isString(options)) {
      result = {
        uri: options,
      };
    }

    // 增加统一前缀
    if (result.uri && result.uri.indexOf('http') !== 0) {
      result.uri = this.urlPrefix + result.uri;
    }

    // 默认GET
    result.method = method || 'GET';

    // 设置post参数
    if (result.method === 'POST') {
      result.params = params;
      if (this.commonParams) {
        this.commonParams.forEach(function (commonParams) {
          result.params = commonParams.configParams(result.params);
        });
      }
    } else {
      let uri = new URI(result.uri);
      let paramStr = uri.search();
      let currentParams = URI.parseQuery(paramStr);
      let resultParams = _.extend(params, currentParams);
      resultParams = dealElement(resultParams);//过滤掉接口请求参数对象中的无效字段:undefined null ''
      if (this.commonParams) {
        this.commonParams.forEach(function (commonParams) {
          resultParams = commonParams.configParams(resultParams);
        });
      }

      uri.setSearch(resultParams);
      //result.uri = URI.decode(uri.toString());
      result.uri = uri.toString()
    }

    // encode非url字符
    //result.uri = encodeURI(result.uri);

    // 默认20秒超时
    result.timeout = result.timeout || 40000; // 因报告返回时间较长，超时延长
    result.url = result.uri;
    result.data = result.form;
    return result;
  }

  /**
   * @description 将请求封装为Promise对象
   * @param {Object} options
   * @returns {Promise} 请求对应的Promise对象
   * @see {@link https://github.com/request/request#requestoptions-callback}
   */
  request(options) {
    // let tag = new URI(options.uri).path() || 'url';
    console.log(options.uri);
    // let that = this;
    return new Promise(function (resolve, reject)
    {
      axios(options).then(function (response)
      {
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
        if (response.status === 200 || response.status === 304) {
          try {
            // keepRaw 表示使用原始数据,不转换
            if (options.keepRaw) {
              resolve(response.data)
            } else {
              resolve(JSON.stringify(response.data));
            }
          } catch (err) {
            // console.log('接口返回值解析异常')
            logger.error(error.name, {
              time: new Date().toLocaleString,
              requestHeaders: options.headers || {},
              url: options.url,
              errName: error.name,
              errMsg: error.message,
              errStack: error.stack
            });
            // 处理接口返回值解析异常
            reject(err);
          }
        } else {
          // console.log('接口返回状态异常')
          // 处理接口返回状态异常
          let wrongHttpStatusError = logger.createError('HttpStatusError', 'http请求返回值不是200或者304');
          logger.error(wrongHttpStatusError.name, {
            time: new Date(),
            requestHeaders: options.headers || {},
            url: options.url,
            errName: wrongHttpStatusError.name,
            errMsg: wrongHttpStatusError.message,
            errStack: wrongHttpStatusError.stack
          });
          reject(wrongHttpStatusError);
        }
      }).catch(function (error) {
        // console.log('请求接口报错')
        // console.log(error);
        logger.error(error.name, {
          time: new Date(),
          requestHeaders: options.headers || {},
          url: options.url,
          errName: error.name,
          errMsg: error.message,
          errStack: error.stack
        });
        reject(error);
      });
    });
  }

  /**
   * @description get请求快捷方法
   * @params {String} 请求url
   * @returns {Promise}
   */
  get(url, params) {
    let options = this.getOptions(url, 'GET', params);
    return this.request(options);
  }

  /**
   * 取HTML文件
   * @param url
   * @param params
   * @returns {Promise}
   */
  getHtml(url, params) {
    let options = this.getOptions(url, 'GET', params);
    options.headers = {'Content-Type': 'text/html;charset=UTF-8'}
    options.keepRaw = true
    return this.request(options);
  }

  /**
   * 取XML文件
   * @param url
   * @param params
   * @returns {Promise}
   */
  getXML(url, params) {
    let options = this.getOptions(url, 'GET', params);
    options.headers = {'Content-Type': 'text/xml;charset=UTF-8'}
    options.keepRaw = true
    return this.request(options);
  }

  /**
   * @description 接口类get请求快捷方法，将json串转换为对象
   * @param {String} 请求url
   * @returns {Promise}
   */
  getJson(url, params) {
    return this.get(url, params).then(function (body) {
      return JSON.parse(body);
    });
  }

  /**
   * @description post请求快捷方法
   * @param {String|Object} options 请求url
   * @param {String|Object} form 表单参数
   * @returns {Promise}
   * @see {@link module:http.request}
   */
  post(url, form) {
    let options = this.getOptions(url, 'POST', form);
    options.headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'};
    return this.request(options);
  };

  /**
   * @description delete请求快捷方法
   * @param {String|Object} options 请求url
   * @param {String|Object} form 表单参数
   * @returns {Promise}
   * @see {@link module:http.request}
   */
  delete(url, form) {
    let options = this.getOptions(url, 'delete', form);
    return this.request(options);
  };

  /**
   * @description delete请求快捷方法 将json串转换为对象
   * @param {String|Object} options 请求url
   * @param {String|Object} form 表单参数
   * @returns {Promise}
   * @see {@link module:http.request}
   */
  deleteJson(url, form) {
    return this.delete(url, form).then(function (body) {
      return JSON.parse(body);
    });
  };

  /**
   * @description put请求快捷方法
   * @param {String|Object} options 请求url
   * @param {String|Object} form 表单参数
   * @returns {Promise}
   * @see {@link module:http.request}
   */
  put(url, form) {
    let options = this.getOptions(url, 'PUT', form);
    return this.request(options);
  };

  /**
   * @description 接口类post请求快捷方法，将json串转换为对象
   * @param {String}  url   请求url
   * @param {Object}  form  表单键值对
   * @returns {Promise}
   */
  postJson(url, form, options) {
    return this.post(url, form, options).then(function (body) {
      return JSON.parse(body);
    });
  };

  /**
   * @description 接口类post请求快捷方法，将json串转换为对象
   * @param {String}  url   请求url
   * @param {Object}  form  表单键值对
   * @returns {Promise}
   */
  putJson(url, form) {
    return this.put(url, form).then(function (body) {
      return JSON.parse(body);
    });
  };
}

function dealElement(obj) {
  let param = {};
  if (obj === null || obj === undefined || obj === "") return param;
  for (let key in obj) {
    // if ( obj[key] !== null && obj[key] !== undefined && obj[key] !== "" ){
    if (obj[key] !== null && obj[key] !== undefined) {
      param[key] = obj[key];
    }
  }
  return param;
}

function deepCopy(obj) {
  if (typeof obj !== 'object') return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}

export default {
  ClientAxios
};
