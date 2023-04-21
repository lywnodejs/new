import style from './style.less'
import Head from 'next/head'
import {fetch} from '~/utils/fetch'

const safeinfos = [
  {
    imgName: require('~/assets/image/about/fair.png'),
    title: '严格遵循国家政策',
    desc:
      '产品费用透明，严格遵守国家监管政策要求，无任何违法或不符合政策要求的利率及费用。',
  },
  {
    imgName: require('~/assets/image/about/encryption.png'),
    title: '个人信息加密',
    desc:
      '应用加密算法全程加密你的信息，为隐私筑墙，杜绝任何形式的个人信息披露。',
  },
]

function body({data}) {
  return (
    <div className={style.rootDiv}>
      <Head>
        <title>关于{data.productDetailIntro.productName}</title>
      </Head>
      <div className={style.topDiv}>
        <div className={style.summaryDiv}>
          <h1>{data.productDetailIntro.productName}</h1>
          <p>{data.productDetailIntro.productIntro}</p>
        </div>
      </div>
      <div className={style.introduceDiv}>
        <div style={{marginBottom: '10px'}}>
          <SectionHeader title="产品特点" />
        </div>
        <ul>
          {data.productDetailFeatures
            .map(function (item) {
              return {title: item.key, desc: item.value}
            })
            .map(function (val, index) {
              return <IntroduceItem {...val} key={index} />
            })}
        </ul>
      </div>
      <div className={style.introduceDiv}>
        <SectionHeader title="申请条件" />
        <Condition conditions={data.productConditions} />
      </div>
      <div className={style.introduceDiv}>
        <SectionHeader title="贷款流程" />
        <Flow />
      </div>
      <div className={style.safeDiv}>
        <div style={{marginBottom: '30px'}}>
          <SectionHeader title="安全保障" />
        </div>
        <ul>
          {safeinfos.map(function (val, index) {
            return <SafeItem {...val} key={index} />
          })}
        </ul>
      </div>
    </div>
  )
}

function SectionHeader(props) {
  return (
    <div className={style.sectionHeaderDiv}>
      <h1>{props.title}</h1>
    </div>
  )
}

function IntroduceItem(props) {
  return (
    <li>
      <div className={style.introduceItemDiv}>
        <div>
        <h1>{props.title}</h1>
        </div>
        <div>
        <h2>{props.desc}</h2>
        </div>
      </div>
    </li>
  )
}

function Condition({conditions}) {
  return (
    <div className={style.conditionDiv}>
      <div className={style.squareDiv} />
      <div className={`${style.squareDiv} ${style.squareRightTop}`} />
      <div className={`${style.squareDiv} ${style.squareLeftBottom}`} />
      <div className={`${style.squareDiv} ${style.squareRightBottom}`} />
      <ul>
        {conditions.map(function (val, index) {
          return (
            <li key={index}>
              <span>{val}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Flow() {
  return (
    <div className={style.flowDiv}>
      <div className={style.flowLeft}>
        <img
          src={require('~/assets/image/about/flow_one.png')}
          className={style.flowImg}
        />
        <h2>在线申请</h2>
        <span>填写资料</span>
      </div>
      <div className={style.flowCenter}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <img
            src={require('~/assets/image/about/flow_arrow.png')}
            className={style.flowArrow}
            style={{marginRight: '10px'}}
          />
          <img
            src={require('~/assets/image/about/flow_two.png')}
            className={style.flowImg}
          />
          <img
            src={require('~/assets/image/about/flow_arrow.png')}
            className={style.flowArrow}
            style={{marginLeft: '10px'}}
          />
        </div>

        <h2>官方审核</h2>
        <span>额度评估</span>
      </div>
      <div className={style.flowRight}>
        <img
          src={require('~/assets/image/about/flow_three.png')}
          className={style.flowImg}
        />
        <h2>贷款发放</h2>
        <span>放款到账</span>
      </div>
    </div>
  )
}

function SafeItem(props) {
  return (
    <li>
      <div
        className={style.safeItemDiv}
        style={{backgroundImage: `url(${props.imgName})`}}
      >
        <h2>{props.title}</h2>
        <p>{props.desc}</p>
      </div>
    </li>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {productId},
  },
}) => {
  try {
    const {
      data: {code, data} = {code: -1, data: {}},
    } = await fetch(
      'bank.api.read.personal.homepagepersonalreadservice.productdetail',
      [{productId}],
    )
    if (code === 0) {
      return {data}
    }
    return {}
  } catch (err) {
    console.log(err)
    return {}
  }
}

export default body
