import * as React from 'react'
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-light.css';
import vim from 'highlight.js/lib/languages/vim';
import UseTable from '@/components/Table'
import { IBase } from '@/interfaces'
import { t } from '@/utils'

hljs.registerLanguage('vim', vim);


import './style'

const dataSource = [
  {
    text: 'status',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '管控状态：封禁、禁言'
  },
  {
    text: 'reason',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '原因，可解析为数组（每个场景的审核不通过原因可进行配置）'
  },
  {
    text: 'code',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '原因对应的code，可解析为数组（每个场景的审核不通过code可进行配置'
  },
  {
    text: 'uid',
    name: '业务方',
    name_class: 'String',
    bool: 'Y',
    remark: '用户id（此字段为可变字段，根据业务方的需求可进行自定义，例如修改为user_id）'
  },
  {
    text: 'timeUnit',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '管控时间单位，day、hour'
  },
  {
    text: 'duration',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '管控时长'
  },
  {
    text: 'biz_type',
    name: '业务方',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段'
  },
  {
    text: 'operator',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '操作人邮箱'
  },
  {
    text: 'duration',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '解封时间'
  },
];
const backDataSource = [
  {
    text: 'errno',
    name: '风险项',
    name_class: 'Int',
    bool: 'Y',
    remark: '0表示成功，非0为失败'
  },
  {
    text: 'apiMsg',
    name: '异常状态信息',
    name_class: 'String',
    bool: 'Y',
    remark: '接口返回提示信息'
  }
];
const columns = [
  {
    title: t('回参字段'),
    dataIndex: 'text',
    key: 'text',
  },
  {
    title: t('来源'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('类型'),
    dataIndex: 'name_class',
    key: 'name_class',
  },
  {
    title: t('必填'),
    dataIndex: 'bool',
    key: 'bool',
  },
  {
    title: t('描述'),
    dataIndex: 'remark',
    key: 'remark',
    width: 300
  },
];
const backColumns = [
  {
    title: t('字段'),
    dataIndex: 'text',
    key: 'text',
  },
  {
    title: t('类型'),
    dataIndex: 'name_class',
    key: 'name_class',
  },
  {
    title: t('必填'),
    dataIndex: 'bool',
    key: 'bool',
  },
  {
    title: t('描述'),
    dataIndex: 'remark',
    key: 'remark',
    width: 300
  },
];
const columnsContent = [
  {
    title: t('字段'),
    dataIndex: 'text',
    key: 'text',
  },
  {
    title: t('来源'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('类型'),
    dataIndex: 'name_class',
    key: 'name_class',
  },
  {
    title: t('必填'),
    dataIndex: 'bool',
    key: 'bool',
  },
  {
    title: t('描述'),
    dataIndex: 'remark',
    key: 'remark',
    width: 300
  },
];
const dataSourceContent = [
  {
    text: 'mainLatitudeId',
    name: '内容安全',
    name_class: 'long',
    bool: 'Y',
    remark: '用户维度id，由内容安全部提供'
  },
  {
    text: 'mainLatitudeValue',
    name: '业务方',
    name_class: 'long',
    bool: 'Y',
    remark: '用户维度对应的值，由业务方提供'
  },
  {
    text: 'sceneId',
    name: '内容安全',
    name_class: 'long',
    bool: 'Y',
    remark: '场景ID，由内容安全部提供'
  },
  {
    text: 'status',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '用户管控状态，由内容安全部提供枚举值'
  },
  {
    text: 'timeUnit',
    name: '内容安全',
    name_class: 'String',
    bool: '',
    remark: '管控时间单位，day、hour，用来自动解封用'
  },
  {
    text: 'duration',
    name: '内容安全',
    name_class: 'int',
    bool: '',
    remark: '管控时长，用来自动解封用'
  },
  {
    text: 'operatorType',
    name: '业务方',
    name_class: 'String',
    bool: 'Y',
    remark: '1:内容安全，2:业务方'
  }
];

interface IState {
  tabData: any,
  tabIndex: Number
}

class HelpUserControl extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabIndex: 0,
      tabData: [
        t('接口协议'),
        t('参数详情'),
        t('回调接口返回详情'),
        t('业务方同步给内容安全')
      ]
    }
  }

  componentDidMount() {
    this.highlightCallBack();

  }

  // tab切换点击
  tabClick = (index) => {
    this.setState({
      tabIndex: index,
    })
  }

  //代码高亮
  highlightCallBack = () => {
    let ele: any = document.querySelectorAll("code")
    for (let i = 0; i < ele.length; i++) {
      try { hljs.highlightBlock(ele[i]); }
      catch (e) { console.log(e); }
    }
  };

  render() {
    const { tabData, tabIndex } = this.state;
    return (
      <div className="project-help-interface-user">

        <div className="project-help-interface-user__content">
          <h3>{t('接口说明')}</h3>
        </div>
        <p className="project-help-interface-user__introduce">
          {t('用户管控需要内容安全部与业务方交互，同步双方对用户的管控结果。')}
        </p>

        <div className="project-help-interface-user__tab">
          {
            tabData.map((item, index) => {
              return (
                <span
                  onClick={() => this.tabClick(index)}
                  className={tabIndex === index ? 'interface-tab--active' : ''}
                >
                  {item}
                </span>
              )
            })
          }
        </div>

        {/* 下侧内容 */}
        <div style={{ display: tabIndex === 0 ? 'block' : 'none' }} className="project-help-interface-user__tabContent">
          <p>{t('回调接口使用http协议，支持post/get方式，同时http header中的content-type支持application/x-www-from-urlencoded或者application/json 两种类型；数据直接放在body中回调；')}</p>
          <p>{t('回调接口期待业务方响应结果为json，同时业务方响应header中的content-type需要设置为application/json；期待业务方响应json格式为：')}</p>
          <p>{t('errno主要用于判断是否回调成功，失败（响应报文不包括errno或errno非0或响应为空）后会进行重试，总共会尝试三次。')}</p>
          <code>
            {`{"errno":0,"msg":"成功"}`}
          </code>
          <p>{t('建议业务方提供接受post方式的application/json的json格式接口；')}</p>
        </div>

        <div style={{ display: tabIndex === 1 ? 'block' : 'none' }} className="project-help-interface-user__tabContent">
          <p>{t('可定制业务方期望回调的参数，如机器审核业务字段中包含title ，可以定制回调给业务方的参数中增加 title字段，样例如下：')}</p>
          <pre>
            <code>
              {`1，
{ 
  "uid":"2",
  "status":"2",
  "timeUnit":"day",
  "duration":"10"
  "reason":"[\"内容不合格\",\"涉政\"]",
  "code": "[\"60002\",\"60001\"]",
  "biz_type":"1",
  "operator":"syy",
  "upseal":"2020-10-23 12:12:12"
}
              `}
            </code>
          </pre>
          <div className="project-help-interface-user__tabContent--table">
            <UseTable
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

        </div>

        <div style={{ display: tabIndex === 2 ? 'block' : 'none' }} className="project-help-interface-user__tabContent">
          <pre>
            <code>
              {`{"errno":0,"msg":"成功"}`}
            </code>
          </pre>

          <div className="project-help-interface-user__tabContent--table">
            <UseTable
              dataSource={backDataSource}
              columns={backColumns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>
        </div>

        <div style={{ display: tabIndex === 3 ? 'block' : 'none' }} className="project-help-interface-user__tabContent">
          <p>{t('队列为ddmq')}</p>
          <div className="project-help-interface-user__tabContent--table" style={{ marginBottom: '30px' }}>
            <UseTable
              dataSource={[
                {
                  text: 'consec_user_con_state_update',
                  name: '测试环境',
                  remark: 'test-线下测试集群'
                },
                {
                  text: '',
                  name: '预发环境',
                  remark: ''
                },
                {
                  text: '',
                  name: '生产环境',
                  remark: ''
                }
              ]}
              columns={[
                {
                  title: t('环境'),
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: t('队列'),
                  dataIndex: 'text',
                  key: 'text',
                },
                {
                  title: t('环境'),
                  dataIndex: 'remark',
                  key: 'remark',
                },
              ]}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

          <pre>
            <code>
              {`{
    "mainLatitudeId":"2",
    "mainLatitudeValue":"2",
    "sceneId":"88",
    "status":"2",
    "timeUnit":"day",
    "duration":"10",
    "operatorType":"1"
}`}
            </code>
          </pre>

          <div className="project-help-interface-user__tabContent--table" style={{ marginBottom: '30px' }}>
            <UseTable
              dataSource={dataSourceContent}
              columns={columnsContent}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

        </div>

      </div>
    )
  }
}

export default HelpUserControl

