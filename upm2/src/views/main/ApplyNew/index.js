import React from 'react';
import { Modal } from 'antd';
import ContentCard from '../../../components/ContentCard';
import connect from '@utils/translateConnect';
import SearchSysAdmin from '@components/SearchSysAdmin';
import ApplyForm from './ApplyForm';
import CBreadcrumb from '@components/Breadcrumb';
import { MAIN } from '@routes/config';

import './index.less';

class ApplyNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      helps: [1, 2],
      visible: true,
      isShowSearchSysAdminComp: true
    };
  }

  handleClose = () => {
    this.setState({
      visible: false
    });
  };

  /**
   * 表单数据变化时的处理逻辑
   */
  // handleFormChange = (values) => {
  //   const { dispatch, params, resourceTypeList } = this.props;
  //   const { appId, role, resourceType } = values;
  // }

  /**
   * 监听 props 变化，如果 appId 改变了则发请求获取该系统的使用介绍
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    // console.log(this.props.appId, nextProps.appId)

    if (this.props.appId !== nextProps.appId && nextProps.appId) {
      this.props
        .dispatch({
          type: 'interfacePerson/fetch',
          payload: {
            appId: nextProps.appId
          }
        })
        .then(adminusers => {
          this.setState({
            isShowSearchSysAdminComp: adminusers.length > 0 ? true : false
          });
        });
      this.props.dispatch({
        type: 'newApply/fetchAppIntroduce',
        payload: {
          appId: nextProps.usrAppId || nextProps.appId,
          appIdRel: nextProps.appId
        }
      });
    }

    if (this.props.userInfo !== nextProps.userInfo) {
      if (nextProps.userInfo.applyTips) {
        Modal.warning({
          title: this.props.t('系统提示'),
          centered: true,
          content: nextProps.userInfo.applyTips
        });
      }
    }
  }

  render() {
    const { t, userInfo, match, history, appId, dispatch } = this.props;
    const { isShowSearchSysAdminComp } = this.state;
    let { introduce } = this.props;
    introduce = introduce || {};
    const { permissionConsultant, consultGroup } = introduce;
    const introduceHtml = introduce.content || '';
    let isOpenSys = false;
    const selectedSystem = this.props.apps.find(item => {
      return item.appId == appId;
    });

    // 已经开放申请
    // if (selectedSystem && selectedSystem.isOpenApply == 1) {
    // 新需求，无论是否是开放系统，都显示“权限申请说明”
    if (selectedSystem) {
      isOpenSys = true;
    }

    // const introduceStyle = isOpenSys
    //   ? {
    //       // border: '1px solid red',
    //       // padding: 5,
    //       // borderRadius: 5
    //     }
    //   : {};

    const preIntroduce = (
      <p style={{ color: '#FF4747', fontSize: '14px', marginBottom: '8px' }}>
        <b> {t('权限申请说明')}</b>
      </p>
    );

    const consultation = (
      <div>
        {isShowSearchSysAdminComp ? (
          <SearchSysAdmin
            inline
            placement="bottomRight"
            appId={appId}
            clearable={false}
            disabled
            btnText={
              <span>
                咨询
                <a href="" className="upm-warning">
                  系统管理员
                </a>
              </span>
            }></SearchSysAdmin>
        ) : null}
        {isShowSearchSysAdminComp &&
        permissionConsultant &&
        permissionConsultant.length > 0
          ? t('，或')
          : ''}
        <span>
          {permissionConsultant &&
            permissionConsultant.length > 0 &&
            t('系统权限申请咨询人：')}
          {/* ，或系统权限申请咨询人： */}
          {permissionConsultant &&
            permissionConsultant.map((item, index) => {
              return (
                <span key={item.username}>
                  <a
                    target="_blank"
                    href={`https://im.xiaojukeji.com/contact?name=${item.username}`}
                    key={item.username}>
                    {item.usernameZh}
                  </a>
                  {permissionConsultant[index + 1] && <span>、</span>}
                </span>
              );
            })}
        </span>
        <p>
          {consultGroup && (
            <span>
              系统咨询群：
              <a target="_blank" href={consultGroup}>
                {t('点击跳转')}
              </a>
              （点击跳转dchat咨询）
            </span>
          )}
        </p>
      </div>
    );
    const html = isOpenSys ? (
      <div>
        {preIntroduce}
        {consultation}
        <p
          style={{ wordBreak: 'break-all' }}
          dangerouslySetInnerHTML={{ __html: introduceHtml }}></p>
      </div>
    ) : (
      ''
    );

    const applyNewStyle = isOpenSys
      ? {
          borderRight: '2px solid #F2F3F4'
        }
      : null;

    const breadcrumbProps = {
      data: [
        {
          text: t('首页'),
          url: `${MAIN}`
        },
        {
          text: t('申请新权限'),
          url: `${MAIN}/newapply`
        }
      ],
      dispatch
    };

    return (
      <div>
        <CBreadcrumb {...breadcrumbProps} />
        <p style={{ fontSize: '20px', color: '#444444', margin: '16px 0' }}>
          {t('申请新权限')}
        </p>
        {/* <ContentCard title={t('申请新权限')}> */}
        <div className="apply-new-content">
          <div className="apply-new-form" style={applyNewStyle}>
            <ApplyForm
              userInfo={userInfo}
              match={match}
              history={history}
              // onChange={this.handleFormChange}
            ></ApplyForm>
          </div>
          {/* <div style={introduceStyle} className="apply-new-notice" data-intro={t('注意看这里')} data-step={2} dangerouslySetInnerHTML={{ __html: introduceHtml ? preIntroduce + introduceHtml : '' }}></div> */}
          <div
            // style={introduceStyle}
            className="apply-new-notice"
            data-intro={t('注意看这里')}
            data-step={2}>
            {html}
          </div>
        </div>
        {/* <Modal
          centered
          wrapClassName="apply-new-content__modal"
          closable={false}
          width={900}
          visible={this.state.visible}
          onCancel={this.handleClose}
          footer={null}
        >
          <Carousel ref={this.carouselRef}>
            {this.state.helps.map(help => {
              return (
                <div className="apply-new-content__help">
                  <img src={require('@assets/banner.png')}></img>
                </div>
              )
            })}
          </Carousel>
        </Modal> */}
        {/* </ContentCard> */}
      </div>
    );
  }

  componentDidMount() {
    const { userInfo, t } = this.props;

    if (userInfo && userInfo.applyTips) {
      Modal.warning({
        title: t('系统提示'),
        centered: true,
        content: userInfo.applyTips
      });
    }
  }
}

export default connect(({ newApply, userInfo, global }) => {
  const { introduce } = newApply;

  return {
    usrAppId: global.managingApp,
    appId: newApply.params.appId,
    introduce,
    userInfo: userInfo,
    enumMap: global.enumMap,
    apps: global.apps
  };
})(ApplyNew);
