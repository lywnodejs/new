import Head from 'next/head'
import styles from '../../index.less'
import {useRouter} from 'next/router'
function body(props) {
  const router = useRouter()
  const queryParams = router.query
  return (
    <div>
      <Head>
        <title>个人征信查询授权书</title>
      </Head>
      <div className={styles.content}>
        <p className={styles.tc}>
          <strong>查询授权书</strong>
        </p>
        <p className={`${styles.tc} ${styles.f12}`}>
          <strong>
            <strong>（适用于申请网贷业务自然人客户）</strong>
          </strong>
        </p>
        <p>
          <strong>
            <strong>****银行股份有限公司</strong>
          </strong>
          ：
        </p>
        <p>
          本人不可撤销地授权
          <strong>
            <strong>贵行办理</strong>
          </strong>
          <strong>
            <u>
              <strong>审核个人信贷业务申请</strong>
            </u>
          </strong>
          <strong>
            <strong>
              业务时，可以向金融信用信息基础数据库查询、打印、保存、使用本人信用报告，
            </strong>
          </strong>
          同时本人不可撤销地授权
          <strong>
            <strong>
              贵行将包括本人基本信息、信贷信息等信用信息向金融信用信息基础数据库报送(
            </strong>
          </strong>
          <strong>
            <em>
              <strong>
                <em>包括本人在贵行办理业务时产生的不良信息）</em>
              </strong>
            </em>
          </strong>
          <strong>
            <strong>。</strong>
          </strong>
        </p>
        <p>
          本授权书有效期为：
          <strong>
            <strong>
              自本人签署本授权书之日起至上述所有业务授信到期/业务结清之日止。
            </strong>
          </strong>
        </p>
        <p>
          <strong>
            <strong>
              本人知悉并理解本授权书中所有条款的声明，愿意承担授权贵行查询信用信息的法律后果，无论信贷业务是否获批准，本人的授权书、信用报告等资料一律不退回。如信贷业务获得批准，为保证贵行资产质量，本人同意贵行对已授信业务和已发放的贷款进行贷后风险管理时查询本人信用信息。
            </strong>
          </strong>
        </p>
        <p>贵行超出授权查询的一切后果及法律责任由贵行承担。</p>
        <p>特此授权。</p>
        <p>&nbsp;</p>
        <p>授权人：{queryParams.cname || 'cname'}</p>
        <p>身份证件类型：{queryParams.idType || 'idType'}</p>
        <p>证件号码：{queryParams.idNo || 'idNo'}</p>
        <p>授权日期：{queryParams.date || 'date'}</p>
      </div>
    </div>
  )
}

export default body
