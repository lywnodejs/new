import fetch from '~/utils/fetch'
import axios from 'axios'
import config from './config'
import {message} from 'antd'
var instance = axios.create()
export default {
  // 获取数据源列表
  getDataSource(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dscompanyservice.getcompanypage',
      [params],
    )
  },
  // 修改数据源状态
  changeDSStatus(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dscompanyservice.updateenablestatus',
      [params],
    )
  },
  // 编辑数据源
  editDSItem(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dscompanyservice.savedscompany',
      [params],
    )
  },
  // 获取数据源账号配置
  getDSConfig(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dscompanyservice.paramslist',
      [params],
    )
  },
  // 编辑数据源账号配置
  editDSConfig(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dscompanyservice.paramssave',
      [params],
    )
  },

  // 获取数据产品列表
  getProduct(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsproductservice.getproductpage',
      [params],
    )
  },
  // 获取产品类别
  async getProductType() {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.ds.management.facade.api.dsproductservice.producttypelist',
      [{}],
    )
    if (code == 0) {
      return data
    } else {
      return []
    }
  },
  // 修改产品报警开关状态
  upProductWaringStatus(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsproductservice.updateenablealarm',
      [params],
    )
  },
  // 编辑产品
  editProduct(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsproductservice.savedsproduct',
      [params],
    )
  },
  // 获取产品报警配置
  getPWaringConfig(id) {
    return fetch(
      'fincloud.ds.management.facade.api.dsproductservice.alertstrategylist',
      [{id}],
    )
  },
  // 修改产品报警配置
  updatePWaringConfig(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsproductservice.savealertstrategy',
      [params],
    )
  },
  // 获取产品报警配置枚举信息
  async getPWaringEnum() {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.ds.management.facade.api.dsproductservice.getstrategyenums',
      [{}],
    )
    if (code == 0) {
      return data
    } else {
      return {}
    }
  },
  // 获取数据产品账号配置
  getProConfig(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsproductservice.paramlist',
      [params],
    )
  },
  // 编辑数据产品账号配置
  editProConfig(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsproductservice.saveparams',
      [params],
    )
  },

  formatSelectData({code, data}) {
    if (code == 0 && Array.isArray(data.list)) {
      return data.list
    } else {
      return []
    }
  },
  // 获取下拉框数据源数据
  async getDS4select() {
    let {data} = await this.getDataSource({pageNo: 1, pageSize: 10000})
    return this.formatSelectData(data)
  },
  // 获取下拉框数据产品数据
  async getProduct4select(companyName) {
    let {data} = await this.getProduct({
      pageNo: 1,
      pageSize: 10000,
      companyName,
    })
    return this.formatSelectData(data)
  },

  // 编辑数据产品账号配置
  getMonitorReport(params) {
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdsmonitorpage',
      [params],
    )
  },
  // 获取数据监控图表
  getMonitorReportChart(params) {
    params.pageNo = 1
    params.pageSize = 10000
    // params.companyId = 5
    // params.dataProductId = 1001
    // params.statDateStart = '2010-08-11'
    // params.statDateEnd = '2020-08-24'
    console.log(params)
    return this.getMonitorReport(params)
  },

  // 获取业务管理列表
  getBusinessList(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsapicallerservice.getcallerpage',
      [params],
    )
  },
  async getBusiness4select() {
    let params = {
      pageNo: 1,
      pageSize: 10000,
    }
    let {
      data: {code, data},
    } = await this.getBusinessList(params)
    if (code == 0) {
      return data.list
    }
    return []
  },
  upBusinessStatus(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsapicallerservice.updateenablestatus',
      [params],
    )
  },
  editBusinessItem(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dsapicallerservice.savecaller',
      [params],
    )
  },

  // 获取数据产品分日统计报表
  getDataDateReport(params) {
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdsprdailypage',
      [params],
    )
  },
  // 数据产品汇总报表
  getDataProductReport(params) {
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdsprgpsumpage',
      [params],
    )
  },
  // 获取数据产品财务报表
  getFinDataProList(params) {
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdsprfinpage',
      [params],
    )
  },
  // 获取数据产品财务图表
  getFinDataProChart(params) {
    params.pageNo = 1
    params.pageSize = 3000
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdatafinchart',
      [params],
    )
  },

  // 获取业务分日统计报表
  getBusinessDateReport(params) {
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdscallerdailypage',
      [params],
    )
  },
  // 获取业务汇总报表
  getBusinessCollectReport(params) {
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdscallersumpage',
      [params],
    )
  },
  // 获取业务财务报表
  getFinBusinessList(params) {
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdscallerfinpage',
      [params],
    )
  },
  // 获取业务财务图表
  getFinBusinessChart(params) {
    params.pageNo = 1
    params.pageSize = 3000
    return fetch(
      'fincloud.ds.management.facade.statistics.statdsdailyservice.getdscallerfinchart',
      [params],
    )
  },

  // 获取用户记录列表
  getRecordList(params) {
    return fetch(
      'fincloud.ds.management.facade.api.dscalldetailservice.getrecordpage',
      [params],
    )
  },
  // 获取用户记录详情
  getRecordDetail(id) {
    return fetch(
      'fincloud.ds.management.facade.api.dscalldetailservice.getdetail',
      [{id}],
    )
  },

  downloadMonitor(params) {
    this.downloadFile('/ds/stat/download/data/monitor', params)
  },
  downloadDataDate(params) {
    this.downloadFile('/ds/stat/download/data/daily', params)
  },
  downloadDataPro(params) {
    this.downloadFile('/ds/stat/download/data/sum', params)
  },
  downloadBusDate(params) {
    this.downloadFile('/ds/stat/download/biz/daily', params)
  },
  downloadBusCol(params) {
    this.downloadFile('/ds/stat/download/biz/sum', params)
  },
  downloadFinBus(params) {
    this.downloadFile('/ds/stat/download/biz/fin', params)
  },
  downloadFinData(params) {
    this.downloadFile('/ds/stat/download/data/fin', params)
  },

  downloadFile(url, params) {
    url = config.downloadApiPrefix + url
    instance({url, params, responseType: 'arraybuffer'})
      .then((res) => {
        try {
          let temp = res.headers['content-disposition'].split("''")[1]
          let blob = new Blob([res.data], {type: res.headers['content-type']})
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = decodeURI(temp) //下载后文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (e) {
          message.error('下载失败')
          console.error(e)
        }
      })
      .catch((error) => {
        message.error('下载失败')
        console.error(error)
      })
  },
}
