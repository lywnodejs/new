import React from 'react';
import _ from 'lodash';
import request from '@utils/request';
import connect from '@utils/translateConnect';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  message
} from 'antd';
import config from '@config/style';
import moment from 'moment';
import EditModal from './EditModal'; // 分类编辑页面
import UserModal from './UserModal'; // 关联用户页面
import './index.less';

const FormItem = Form.Item;
const { Column } = Table;
const confirm = Modal.confirm;
const { searchForm } = config;
const TableStyle = {
  buttonSize: 'small'
};
const countryList = [
  { name: 'Angola', name_zh: '安哥拉' },
  { name: 'Afghanistan', name_zh: '阿富汗' },
  { name: 'Albania', name_zh: '阿尔巴尼亚' },
  { name: 'Algeria', name_zh: '阿尔及利亚' },
  { name: 'Andorra', name_zh: '安道尔共和国' },
  { name: 'Anguilla', name_zh: '安圭拉岛' },
  { name: 'Antigua and Barbuda', name_zh: '安提瓜和巴布达' },
  { name: 'Argentina', name_zh: '阿根廷' },
  { name: 'Armenia', name_zh: '亚美尼亚' },
  { name: 'Ascension', name_zh: '阿森松' },
  { name: 'Australia', name_zh: '澳大利亚' },
  { name: 'Austria', name_zh: '奥地利' },
  { name: 'Azerbaijan', name_zh: '阿塞拜疆' },
  { name: 'Bahamas', name_zh: '巴哈马' },
  { name: 'Bahrain', name_zh: '巴林' },
  { name: 'Bangladesh', name_zh: '孟加拉国' },
  { name: 'Barbados', name_zh: '巴巴多斯' },
  { name: 'Belarus', name_zh: '白俄罗斯' },
  { name: 'Belgium', name_zh: '比利时' },
  { name: 'Belize', name_zh: '伯利兹' },
  { name: 'Benin', name_zh: '贝宁' },
  { name: 'Bermuda Is.', name_zh: '百慕大群岛' },
  { name: 'Bolivia', name_zh: '玻利维亚' },
  { name: 'Botswana', name_zh: '博茨瓦纳' },
  { name: 'Brazil', name_zh: '巴西' },
  { name: 'Brunei', name_zh: '文莱' },
  { name: 'Bulgaria', name_zh: '保加利亚' },
  { name: 'Burkina-faso', name_zh: '布基纳法索' },
  { name: 'Burma', name_zh: '缅甸' },
  { name: 'Burundi', name_zh: '布隆迪' },
  { name: 'Cameroon', name_zh: '喀麦隆' },
  { name: 'Canada', name_zh: '加拿大' },
  { name: 'Cayman Is.', name_zh: '开曼群岛' },
  { name: 'Central African Republic', name_zh: '中非共和国' },
  { name: 'Chad', name_zh: '乍得' },
  { name: 'Chile', name_zh: '智利' },
  { name: 'China', name_zh: '中国' },
  { name: 'Colombia', name_zh: '哥伦比亚' },
  { name: 'Congo', name_zh: '刚果' },
  { name: 'Cook Is.', name_zh: '库克群岛' },
  { name: 'Costa Rica', name_zh: '哥斯达黎加' },
  { name: 'Cuba', name_zh: '古巴' },
  { name: 'Cyprus', name_zh: '塞浦路斯' },
  { name: 'Czech Republic', name_zh: '捷克' },
  { name: 'Denmark', name_zh: '丹麦' },
  { name: 'Djibouti', name_zh: '吉布提' },
  { name: 'Dominica Rep.', name_zh: '多米尼加共和国' },
  { name: 'Ecuador', name_zh: '厄瓜多尔' },
  { name: 'Egypt', name_zh: '埃及' },
  { name: 'EI Salvador', name_zh: '萨尔瓦多' },
  { name: 'Estonia', name_zh: '爱沙尼亚' },
  { name: 'Ethiopia', name_zh: '埃塞俄比亚' },
  { name: 'Fiji', name_zh: '斐济' },
  { name: 'Finland', name_zh: '芬兰' },
  { name: 'France', name_zh: '法国' },
  { name: 'French Guiana', name_zh: '法属圭亚那' },
  { name: 'Gabon', name_zh: '加蓬' },
  { name: 'Gambia', name_zh: '冈比亚' },
  { name: 'Georgia', name_zh: '格鲁吉亚' },
  { name: 'Germany', name_zh: '德国' },
  { name: 'Ghana', name_zh: '加纳' },
  { name: 'Gibraltar', name_zh: '直布罗陀' },
  { name: 'Greece', name_zh: '希腊' },
  { name: 'Grenada', name_zh: '格林纳达' },
  { name: 'Guam', name_zh: '关岛' },
  { name: 'Guatemala', name_zh: '危地马拉' },
  { name: 'Guinea', name_zh: '几内亚' },
  { name: 'Guyana', name_zh: '圭亚那' },
  { name: 'Haiti', name_zh: '海地' },
  { name: 'Honduras', name_zh: '洪都拉斯' },
  { name: 'Hongkong', name_zh: '香港' },
  { name: 'Hungary', name_zh: '匈牙利' },
  { name: 'Iceland', name_zh: '冰岛' },
  { name: 'India', name_zh: '印度' },
  { name: 'Indonesia', name_zh: '印度尼西亚' },
  { name: 'Iran', name_zh: '伊朗' },
  { name: 'Iraq', name_zh: '伊拉克' },
  { name: 'Ireland', name_zh: '爱尔兰' },
  { name: 'Israel', name_zh: '以色列' },
  { name: 'Italy', name_zh: '意大利' },
  { name: 'Ivory Coast', name_zh: '科特迪瓦' },
  { name: 'Jamaica', name_zh: '牙买加' },
  { name: 'Japan', name_zh: '日本' },
  { name: 'Jordan', name_zh: '约旦' },
  { name: 'Kampuchea (Cambodia)', name_zh: '柬埔寨' },
  { name: 'Kazakstan', name_zh: '哈萨克斯坦' },
  { name: 'Kenya', name_zh: '肯尼亚' },
  { name: 'Korea', name_zh: '韩国' },
  { name: 'Kuwait', name_zh: '科威特' },
  { name: 'Kyrgyzstan', name_zh: '吉尔吉斯坦' },
  { name: 'Laos', name_zh: '老挝' },
  { name: 'Latvia', name_zh: '拉脱维亚' },
  { name: 'Lebanon', name_zh: '黎巴嫩' },
  { name: 'Lesotho', name_zh: '莱索托' },
  { name: 'Liberia', name_zh: '利比里亚' },
  { name: 'Libya', name_zh: '利比亚' },
  { name: 'Liechtenstein', name_zh: '列支敦士登' },
  { name: 'Lithuania', name_zh: '立陶宛' },
  { name: 'Luxembourg', name_zh: '卢森堡' },
  { name: 'Macao', name_zh: '中国澳门' },
  { name: 'Madagascar', name_zh: '马达加斯加' },
  { name: 'Malawi', name_zh: '马拉维' },
  { name: 'Malaysia', name_zh: '马来西亚' },
  { name: 'Maldives', name_zh: '马尔代夫' },
  { name: 'Mali', name_zh: '马里' },
  { name: 'Malta', name_zh: '马耳他' },
  { name: 'Mariana Is', name_zh: '马里亚那群岛' },
  { name: 'Martinique', name_zh: '马提尼克' },
  { name: 'Mauritius', name_zh: '毛里求斯' },
  { name: 'Mexico', name_zh: '墨西哥' },
  { name: 'Monaco', name_zh: '摩纳哥' },
  { name: 'Mongolia', name_zh: '蒙古' },
  { name: 'Montserrat Is', name_zh: '蒙特塞拉特岛' },
  { name: 'Morocco', name_zh: '摩洛哥' },
  { name: 'Mozambique', name_zh: '莫桑比克' },
  { name: 'Namibia', name_zh: '纳米比亚' },
  { name: 'Nauru', name_zh: '瑙鲁' },
  { name: 'Nepal', name_zh: '尼泊尔' },
  { name: 'Netheriands Antilles', name_zh: '荷属安的列斯' },
  { name: 'Netherlands', name_zh: '荷兰' },
  { name: 'New Zealand', name_zh: '新西兰' },
  { name: 'Nicaragua', name_zh: '尼加拉瓜' },
  { name: 'Niger', name_zh: '尼日尔' },
  { name: 'Nigeria', name_zh: '尼日利亚' },
  { name: 'North Korea', name_zh: '朝鲜' },
  { name: 'Norway', name_zh: '挪威' },
  { name: 'Oman', name_zh: '阿曼' },
  { name: 'Pakistan', name_zh: '巴基斯坦' },
  { name: 'Panama', name_zh: '巴拿马' },
  { name: 'Papua New Cuinea', name_zh: '巴布亚新几内亚' },
  { name: 'Paraguay', name_zh: '巴拉圭' },
  { name: 'Peru', name_zh: '秘鲁' },
  { name: 'Philippines', name_zh: '菲律宾' },
  { name: 'Poland', name_zh: '波兰' },
  { name: 'French Polynesia', name_zh: '法属玻利尼西亚' },
  { name: 'Portugal', name_zh: '葡萄牙' },
  { name: 'Puerto Rico', name_zh: '波多黎各' },
  { name: 'Qatar', name_zh: '卡塔尔' },
  { name: 'Republic of Moldova', name_zh: '摩尔多瓦' },
  { name: 'Reunion', name_zh: '留尼旺' },
  { name: 'Romania', name_zh: '罗马尼亚' },
  { name: 'Russia', name_zh: '俄罗斯' },
  { name: 'Saint Lueia', name_zh: '圣卢西亚' },
  { name: 'Saint Vincent', name_zh: '圣文森特岛' },
  { name: 'Samoa Eastern', name_zh: '东萨摩亚(美)' },
  { name: 'Samoa Western', name_zh: '西萨摩亚' },
  { name: 'San Marino', name_zh: '圣马力诺' },
  { name: 'Sao Tome and Principe', name_zh: '圣多美和普林西比' },
  { name: 'Saudi Arabia', name_zh: '沙特阿拉伯' },
  { name: 'Senegal', name_zh: '塞内加尔' },
  { name: 'Seychelles', name_zh: '塞舌尔' },
  { name: 'Sierra Leone', name_zh: '塞拉利昂' },
  { name: 'Singapore', name_zh: '新加坡' },
  { name: 'Slovakia', name_zh: '斯洛伐克' },
  { name: 'Slovenia', name_zh: '斯洛文尼亚' },
  { name: 'Solomon Is', name_zh: '所罗门群岛' },
  { name: 'Somali', name_zh: '索马里' },
  { name: 'South Africa', name_zh: '南非' },
  { name: 'Spain', name_zh: '西班牙' },
  { name: 'Sri Lanka', name_zh: '斯里兰卡' },
  { name: 'St.Lucia', name_zh: '圣卢西亚' },
  { name: 'St.Vincent', name_zh: '圣文森特' },
  { name: 'Sudan', name_zh: '苏丹' },
  { name: 'Suriname', name_zh: '苏里南' },
  { name: 'Swaziland', name_zh: '斯威士兰' },
  { name: 'Sweden', name_zh: '瑞典' },
  { name: 'Switzerland', name_zh: '瑞士' },
  { name: 'Syria', name_zh: '叙利亚' },
  { name: 'China Taiwan', name_zh: '中国台湾' },
  { name: 'Tajikstan', name_zh: '塔吉克斯坦' },
  { name: 'Tanzania', name_zh: '坦桑尼亚' },
  { name: 'Thailand', name_zh: '泰国' },
  { name: 'Togo', name_zh: '多哥' },
  { name: 'Tonga', name_zh: '汤加' },
  { name: 'Trinidad and Tobago', name_zh: '特立尼达和多巴哥' },
  { name: 'Tunisia', name_zh: '突尼斯' },
  { name: 'Turkey', name_zh: '土耳其' },
  { name: 'Turkmenistan', name_zh: '土库曼斯坦' },
  { name: 'Uganda', name_zh: '乌干达' },
  { name: 'Ukraine', name_zh: '乌克兰' },
  { name: 'United Arab Emirates', name_zh: '阿拉伯联合酋长国' },
  { name: 'United Kiongdom', name_zh: '英国' },
  { name: 'United States of America', name_zh: '美国' },
  { name: 'Uruguay', name_zh: '乌拉圭' },
  { name: 'Uzbekistan', name_zh: '乌兹别克斯坦' },
  { name: 'Venezuela', name_zh: '委内瑞拉' },
  { name: 'Vietnam', name_zh: '越南' },
  { name: 'Yemen', name_zh: '也门' },
  { name: 'Yugoslavia', name_zh: '南斯拉夫' },
  { name: 'Zimbabwe', name_zh: '津巴布韦' },
  { name: 'Zaire', name_zh: '扎伊尔' },
  { name: 'Zambia', name_zh: '赞比亚' }
];

/**
 * 条件查询
 * @param {*} props
 */
function SearchForm({ t, form, handleSearch, handleAdd, allCategory }) {
  const { getFieldDecorator } = form;

  return (
    <Form className="upm-form" onSubmit={handleSearch}>
      <Row gutter={12}>
        <Col span={12}>
          <FormItem label={t('适用国家')} {...searchForm}>
            {getFieldDecorator('country', {})(
              <Select showSearch allowClear>
                {_.map(countryList, (item, index) => {
                  return (
                    <Select.Option key={index} value={item.name}>
                      {t(`${item.name}`)}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={t('礼包分类名称')} {...searchForm}>
            {getFieldDecorator('categoryId', {})(
              <Select placeholder={t('请选择')} allowClear>
                {_.map(allCategory, ({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={t('权限礼包名称')} {...searchForm}>
            {getFieldDecorator('name', {})(
              <Input placeholder={t('请输入关键字进行模糊搜索')} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Button
              className="upm-form__button"
              type="primary"
              htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" onClick={handleAdd}>
              {t('新增礼包')}
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

/**
 * 分类查询组件
 */
const SearchFormWrapper = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },

  /**
   * 处理数据变化
   * @param {*} props
   * @param {*} values
   */
  onValuesChange(props, values) {
    props.handleValueChange(values);
  }
})(SearchForm);

/**
 * 分类管理组件
 * 包括查询和列表展示功能
 */
class Package extends React.PureComponent {
  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      // 查询参数
      params: {
        categoryId: '',
        name: '',
        country: ''
      },
      // 模态框设置
      modal: {
        type: 'edit', // 模态框类型 edit，编辑
        title: '', // 模态框标题
        style: {}, // 模态框
        visible: false, // 模态框状态
        loading: false, // 加载状态
        footer: [], // 模态框页脚
        id: ''
      },
      oper: 'create', // 分类操作类型 create，新增 update
      currentPage: 1,
      packageInfo: {},
      role: {}
    };
  }

  componentDidMount() {
    this.search();
    this.props.dispatch({
      type: 'managePackage/fetchAllCategory',
      payload: {
        appId: 888
      }
    });
  }

  trim = data => {
    const result = {};
    for (let key in data) {
      result[key] = _.trim(data[key]);
    }
    return result;
  };

  /**
   * 格式化成树状结构
   */
  // formatTree = (data, hasAreas) => {
  formatTree = data => {
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        data[i].title = data[i].name;
        data[i].value = data[i].id + '';
        data[i].key = data[i].id + '';
        // for (let j = 0; j < hasAreas.length; j++) {
        //   if (hasAreas[j].id == data[i].id) {
        //     // data[i].disableCheckbox = true;
        //     data[i].title += this.props.t('(已有该地区权限)');
        //     break;
        //   }
        // }
        if (data[i].children && data[i].children.length) {
          // this.formatTree(data[i].children, hasAreas);
          this.formatTree(data[i].children);
        }
      }
    }
    return data;
  };

  /**
   * 业务线变化时，重置地区
   */
  handleBusinessChangeFromModal = (businessId, appId) => {
    const { dispatch, packageParams } = this.props;
    dispatch({
      type: 'managePackage/mergePackage',
      payload: {
        appsData: {
          ...packageParams.appsData,
          [appId]: {
            ...packageParams.appsData[appId],
            area: []
          }
        }
      }
    });
    this.handleBusinessChange(businessId, appId);
  };

  /**
   * 业务线变化时候的处理逻辑
   */
  handleBusinessChange = (businessId, appId) => {
    const { dispatch } = this.props;

    Promise.all([
      request(`/area/select/tree?businessId=${businessId}&appId=${appId}`)
      // request(`/v2/apply/getUserAreas?businessId=${businessId}&appId=${appId}`)
    ]).then(res => {
      // let data = [];
      // if (res[1]) {
      //   res[1].map(item => {
      //     data.push(item.name);
      //   });
      // }
      dispatch({
        type: 'managePackage/mergeTreeData',
        payload: {
          // [appId]: this.formatTree(res[0], res[1])
          [appId]: this.formatTree(res[0])
        }
      });
      dispatch({
        type: 'managePackage/mergeBusinessId',
        payload: {
          [appId]: businessId
        }
      });
      // this.setState({
      //   businessId,
      //   treeData: this.formatTree(res[0], res[1]),
      // });
    });
  };

  /**
   * 更新查询参数
   */
  changeState = state => {
    this.setState({
      params: {
        ...this.state.params,
        ...state
      }
    });
  };

  /**
   * 搜索
   */
  search = (page = 1) => {
    this.props.dispatch({
      type: 'managePackage/fetchPackageList',
      payload: {
        ...this.trim(this.state.params),
        appId: 888,
        page
      }
    });
  };

  /**
   * 查询操作
   */
  handleSearch = e => {
    this.search();
    if (e) {
      e.preventDefault();
    }
  };

  /**
   * 分页操作
   */
  handlePageChange = page => {
    this.search(page);
    this.setState({
      currentPage: page
    });
  };

  /**
   * 动态创建模态框
   */
  createModal = allCategory => {
    const ModalMap = {
      create: (
        <EditModal
          {...this.state.modal}
          handleBusinessChange={this.handleBusinessChangeFromModal}
          allCategory={allCategory}
          countryList={countryList}
          oper={this.state.oper}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      ),
      edit: (
        <EditModal
          {...this.state.modal}
          handleBusinessChange={this.handleBusinessChangeFromModal}
          allCategory={allCategory}
          countryList={countryList}
          oper={this.state.oper}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      ),
      userModal: (
        <UserModal
          {...this.state.modal}
          _this={this}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          package={this.state.packageInfo}
          info={this.state.role}
          search={this.searchListD}
          searchChild={this.resarchChild}
        />
      )
    };

    return ModalMap[this.state.modal.type];
  };

  /**
   * 打开模态框
   */
  openModal = (type, oper, id) => {
    this.setState({
      modal: {
        type,
        visible: true,
        id
      },
      oper
    });
  };

  /**
   * 设置当前选中分类
   */
  setCurrent = data => {
    // 更新分类信息
    this.props.dispatch({
      type: 'managePackage/mergePackage',
      payload: data
    });
  };

  /**
   * 添加分类
   */
  createPackage = () => {
    this.setCurrent();
    this.openModal('edit', 'create');
  };

  /**
   * 编辑分类
   */
  updatePackage = data => {
    const { dispatch } = this.props;

    this.setCurrent(data);
    dispatch({
      type: 'managePackage/getPackage',
      payload: {
        appId: 888,
        id: data.id
      },
      callback: packageParams => {
        packageParams.apps.forEach(i => {
          const roleIds = packageParams.appsData[i.key].role.map(
            item => item.value
          );
          dispatch({
            type: 'managePackage/getAppBindedBusiness',
            payload: { appId: i.key }
          });
          dispatch({
            type: 'managePackage/fetchPackageStrategyList',
            payload: {
              appId: i.key,
              roleIds,
              groupIds: []
            }
          });
          dispatch({
            type: 'managePackage/fetchResourceType',
            payload: { appId: i.key }
          });
        });
        // 获取项目列表
        for(let prop in packageParams.appsData) {
          const types = Object.keys(packageParams.appsData[prop]) 
          const _index = types.findIndex(t => t == 'bigdata_report' || t == 'bigdata_data_set' )
          if( _index > -1 ) {
            dispatch({
              type: 'managePackage/fetchProjectList',
              payload: { appId: prop, attrName: 'projectName', attrValue: '' }
            });
          }
        }
        for (let i in packageParams.businessId) {
          this.handleBusinessChange(packageParams.businessId[i], i);
        }
      }
    });
    this.openModal('edit', 'update', data.id);
  };

  /**
   * 删除分类
   */
  removePackage = data => {
    const { t } = this.props;

    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props
          .dispatch({
            type: 'managePackage/deletePackage',
            payload: {
              id: data.id,
              appId: 888
            }
          })
          .then(({ success, result }) => {
            this.search();
            message.destroy();
            if (success) {
              // 提示成功，2秒
              message.success(t('删除成功'), 2, () => {});
            } else {
              message.error(t(result));
            }
          });
      }
    });
  };

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    this.setState({
      modal: {
        visible: false
      },
      currentPage: 1
    });

    // 刷新页面
    this.search();
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  /**
   * 设置当前选中角色
   */
  // setCurrent = role => {
  //   // 更新角色信息
  //   this.props.dispatch({
  //     type: 'managePackage/saveRole',
  //     payload: role
  //   });
  // };

  /**
   * 关联用户
   */
  relevantUser = role => {
    let data = {
      packageId: role.id,
      appId: 888
    };

    this.props
      .dispatch({
        type: 'managePackage/getFetchPackageUserList',
        payload: data
      })
      .then(res => {
        this.setState(
          {
            role: res || [],
            packageInfo: role
          },
          () => {
            this.openModal('userModal', 'userModal');
          }
        );
      });
  };

  // 查询
  resarchChild = data => {
    this.props
      .dispatch({
        type: 'managePackage/getFetchPackageUserList',
        payload: data
      })
      .then(res => {
        this.setState({
          role: [...res] || []
        });
      });
  };

  //重置
  searchListD = () => {
    let role = this.state.packageInfo;
    let data = {
      packageId: role.id,
      appId: 888
    };
    this.props
      .dispatch({
        type: 'managePackage/getFetchPackageUserList',
        payload: data
      })
      .then(res => {
        this.setState({
          role: res || [],
          packageInfo: role
        });
      });
  };

  render() {
    const { t, packageList, allCategory } = this.props;
    const { records: datas, size: pageSize, total } = packageList;

    return (
      <div className="upm-content">
        <SearchFormWrapper
          {...this.state.params}
          t={t}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleAdd={this.createPackage}
          allCategory={allCategory}
        />
        <Table
          className="upm-table"
          dataSource={datas}
          rowKey="id"
          pagination={{
            current: this.state.currentPage,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}>
          <Column title={t('ID')} dataIndex="id" width={100} />
          <Column title={t('适用国家')} dataIndex="country" />
          <Column title={t('礼包分类')} dataIndex="packageCategoryName" />
          <Column title={t('权限礼包名称')} dataIndex="name" />
          <Column title={t('描述')} dataIndex="desc" />
          <Column title={t('创建人')} dataIndex="creator" />
          <Column
            title={t('创建时间')}
            dataIndex="createdAt"
            render={(text, record) => (
              <span>
                {moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
          <Column
            title={t('修改时间')}
            dataIndex="updatedAt"
            render={(text, record) => (
              <span>
                {moment(record.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
          <Column
            title={t('操作')}
            key="action"
            width={200}
            render={(text, record) => (
              <span>
                <Button
                  size={TableStyle.buttonSize}
                  onClick={() => this.updatePackage(record)}>
                  {t('编辑')}
                </Button>
                <Button
                  type="danger"
                  size={TableStyle.buttonSize}
                  onClick={() => this.removePackage(record)}>
                  {t('删除')}
                </Button>
                <Button
                  size={TableStyle.buttonSize}
                  onClick={() => this.relevantUser(record)}>
                  {t('用户绑定')}
                </Button>
              </span>
            )}
          />
        </Table>
        {this.createModal(allCategory)}
      </div>
    );
  }
}

export default connect(({ managePackage }) => {
  return {
    packageList: managePackage.packageList,
    allCategory: managePackage.allCategory,
    packageParams: managePackage.package,
    projectList: managePackage.package.projectList
  };
})(Package);
