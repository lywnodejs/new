import React  from 'react';
import { Button, Input, Row, Col, Table, Select,Popconfirm,message} from 'antd';
import connect from '@utils/translateConnect';
import { fetchFeedbackList } from '../../../../services/userFeedback';

const { Option } = Select;
class SystemManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      businessId:'',
      position:'bottom',
      pageSize:10,
      current:1,
      size:'small',
      total:0,
      appId:'',
      tableData:[],
      columns:[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          align:'center'
        },
        {
          title: this.props.t('系统名称'),
          dataIndex: 'name',
          key: 'name',
          align:'center'
        },
        {
          title: this.props.t('操作'),
          dataIndex: 'id',
          key: 'id',
          align:'center',
          render:(text,record) => {
            const { t } = this.props;
            return (
              <Popconfirm
                title={t('解除绑定')}
                okText={t('确定')}
                cancelText={t('取消')}
                onConfirm={()=> this.eidtbusiness(record)}
              >
                <Button className="butCLose" type={'link'}>{t('解除绑定')}</Button>
              </Popconfirm>
            )
          }
        }
      ],
      dataSource: []
    };
  }

  componentDidMount() {
    this.getBusinessList();
    this.setState({
      current:1,
      businessId:this.props.id
    })
    if(this.props.onRef){//如果父组件传来该方法 则调用方法将子组件this指针传过去
      this.props.onRef(this)
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      current:1,
      businessId:nextProps.id,
      appId:''
    },()=>{
      this.getBusinessList(nextProps.id);
    })
  }
  getBusinessList = (id)=>{
    let data = {
      businessId:id ||this.props.id,
      appId:888,
      page:this.state.current,
      size:this.state.pageSize
    }
    this.props.getBusinessList(data).then((msg)=>{
        this.setState({
          dataSource:msg.records,
          total:msg.total
        })
    })
  }
  handlePageChange = (page)=>{
      this.setState({
        current:page
      },()=>{
        this.getBusinessList();
      })
  }
  // 解除绑定
  eidtbusiness = (item)=>{
    let { businessId } = this.state;
    const { t } = this.props;
    let data ={
      appId:888,//upm的系统id固定
      id:item.id,//要绑定/解绑的系统id
      businessIds:[businessId], //要绑定／解绑的业务线id
      bind:false//是否绑定true：绑定 false：解绑
    }
    this.props.editBusinessList(data).then(()=>{
      message.success(t('解绑成功'));
      this.setState({
        current:1
      },()=>{
        this.getBusinessList();
      })
    })
  }

  getVal = (val)=>{
    this.setState({
      appId:val
    })
  }

  handleDelBusiness = ()=>{
    let { businessId ,appId} = this.state;
    const { t } = this.props;
    if(!appId){
      message.error(t('请选择系统'));
      return false;
    }
    let data ={
      appId:888,//upm的系统id固定
      id:appId,//要绑定/解绑的系统id
      businessIds:[businessId], //要绑定／解绑的业务线id
      bind:true//是否绑定true：绑定 false：解绑
    }
    this.props.editBusinessList(data).then(()=>{
      message.success(t('绑定成功'));
      this.setState({
        current:1
      },()=>{
        this.getBusinessList();
      })
    })
  }



  render() {
    const {t} = this.props;
    const {current,pageSize,total} = this.state;
     return (
       <div>
         <Row>
           <Col span={14}>
             <span>{t('目标系统')}：</span>
             <Select
               style={{'width':'300px'}}
               placeholder={t('请选择')}
               value={this.state.appId}
               onChange={(value) => this.getVal(value)}
               className='form-select'
               showSearch
               optionFilterProp="children"
             >
               {this.props.apps.map(item => <Select.Option key={item.appId} value={item.appId}>{item.appName}</Select.Option>)}
             </Select>
           </Col>
           <Col span={2} offset={1}>
             <Popconfirm
               title={t('确认绑定')}
               okText={t('确定')}
               cancelText={t('取消')}
               onConfirm={this.handleDelBusiness}
             >
              <Button type="primary">{t("绑定")}</Button>
             </Popconfirm>
           </Col>
         </Row>
         <br/>

         <Table className="interface-person-table"
                size='small'
                dataSource={this.state.dataSource}
                columns={this.state.columns}
                pagination={{
                  current:current,
                  pageSize:pageSize,
                  total:total,
                  size:'small',
                  hideOnSinglePage: true,
                  onChange: this.handlePageChange
                }}
         />
       </div>
       )
  }
}


export default connect(({ global }) => {
  return {
    apps: global.apps
  };
},(dispatch) => ({
  getBusinessList (flag) {
    return dispatch({
      type: 'area/getBusinessList',
      payload: flag
    });
  },
  editBusinessList (flag) {
    return dispatch({
      type: 'area/editBusinessList',
      payload: flag
    });
  },
  delArea (params) {
    dispatch({
      type: 'area/delArea',
      payload: params
    });
  },
}))(SystemManagement);


