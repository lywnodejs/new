import React from 'react';
import ContentCard from '../../../components/ContentCard';
import connect from '@utils/translateConnect';
import ApplyForm from './ApplyForm';
// import InfoCard from './InfoCard';
import CBreadcrumb from '@components/Breadcrumb';
import { MAIN } from '@routes/config';

const FORMWIDTH = 650;

class PackageApply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.params.categoryId !== nextProps.params.categoryId &&
      nextProps.params.categoryId
    ) {
      this.props.dispatch({
        type: 'packageApply/fetchCategoryIntroduce',
        payload: {
          categoryId: nextProps.params.categoryId
        }
      });
    }
  }

  render() {
    const { t, dispatch } = this.props;

    let { introduce } = this.props;
    const introduceHtml = introduce || '';

    const introduceStyle = introduceHtml
      ? {
          // border: '1px solid red',
          // padding: 5,
          // borderRadius: 5
        }
      : {};
    const preIntroduce = `<p style="color: #FF4747;font-size:14px;margin-bottom: 8px;"><b>${t(
      '礼包权限说明'
    )}</b><p>`;

    const applyNewStyle = introduceHtml
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
          text: t('申请礼包权限'),
          url: `${MAIN}/packageapply`
        }
      ],
      dispatch
    };

    return (
      <div>
        <CBreadcrumb {...breadcrumbProps} />
        {/* <ContentCard title={t('申请礼包权限')}> */}
        <p style={{ fontSize: '20px', color: '#444444', margin: '16px 0' }}>
          {t('申请礼包权限')}
        </p>
        <div className="apply-new-content">
          <div className="apply-new-form" style={applyNewStyle}>
            <ApplyForm />
          </div>
          <div
            style={introduceStyle}
            className="apply-new-notice"
            dangerouslySetInnerHTML={{
              __html: introduceHtml ? preIntroduce + introduceHtml : ''
            }}></div>
        </div>
        {/* </ContentCard> */}
      </div>
    );
  }
}

export default connect(({ packageApply }) => {
  const { params, introduce } = packageApply;

  return {
    params,
    introduce
  };
})(PackageApply);
