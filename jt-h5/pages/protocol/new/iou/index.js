import Head from 'next/head'
import styles from '../../index.less'
function body() {
  return (
    <div>
      <Head>
        <title>借据</title>
      </Head>
      <div className={styles.content}>
        <p className={styles.title}>借款借据</p>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.tit}>会计科目：</td>
              <td></td>
              <td className={styles.tit}>借款日期：</td>
              <td></td>
              <td className={styles.tit}>流水号：</td>
              <td></td>
            </tr>
            <tr>
              <td rowSpan="3" className={styles.tit}>
                借款单位
              </td>
              <td>名称</td>
              <td></td>
              <td rowSpan="3" className={styles.tit}>
                收款单位
              </td>
              <td className={styles.tit}>名称</td>
              <td></td>
            </tr>

            <tr>
              <td className={styles.tit}>借据编号</td>
              <td></td>
              <td className={styles.tit}>存款户账号</td>
              <td></td>
            </tr>

            <tr>
              <td className={styles.tit}>开户银行</td>
              <td></td>
              <td className={styles.tit}>开户银行</td>
              <td></td>
            </tr>

            <tr>
              <td className={styles.tit}>
                借款金额
                <br />
                （大写）
              </td>
              <td colSpan="2"></td>
              <td className={styles.tit}>小写</td>
              <td colSpan="2"></td>
            </tr>

            <tr>
              <td className={styles.tit} rowSpan="3">
                借款用途
              </td>
              <td rowSpan="3"></td>
              <td className={styles.tit}>借款种类</td>
              <td></td>
              <td className={styles.tit}>年利率</td>
              <td></td>
            </tr>
            <tr>
              <td className={styles.tit}>借款期限</td>
              <td colSpan="3">自&emsp;&emsp;&emsp;起至&emsp;&emsp;&emsp;止</td>
            </tr>
            <tr>
              <td colSpan="4">
                以上借款由双方签订的编号为&emsp;&emsp;&emsp;&emsp;&emsp;执行
              </td>
            </tr>
            <tr>
              <td colSpan="6">
                <p>借款人单位（人）签章</p>
                <div className={styles.footer}></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default body
