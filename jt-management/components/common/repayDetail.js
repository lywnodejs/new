import {useEffect, useState} from 'react'
import {Button, Row, Col, Table} from 'antd'

function RepayDetail({detail: displaydetail, source}) {
  const [data, setData] = useState([])
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const columns = [
    {
      title: '期数',
      dataIndex: 'term',
      key: 'term',
      width: 80,
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 80,
    },
    {
      title: '应还',
      dataIndex: 'payableAmount',
      key: 'payableAmount',
      width: 100,
    },
    {
      title: '减免',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 100,
    },
    {
      title: '已还',
      dataIndex: 'repaymentAmount',
      key: 'repaymentAmount',
      width: 100,
    },
    {
      title: '剩余应还',
      dataIndex: 'surplusPayableAmount',
      key: 'surplusPayableAmount',
      width: 100,
    },
    {
      title: '应还日期',
      dataIndex: 'deductDate',
      key: 'deductDate',
      width: 100,
    },
    {
      title: '实还日期',
      dataIndex: 'realRepayDate',
      key: 'realRepayDate',
      width: 100,
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 100,
      render: (text, record, index) => {
        return (
          <>
            {record.subject == '总额' && (
              <Button type="link" onClick={() => onCollapsed(index)}>
                {isCollapsed(index) ? '收起' : '展开'}
              </Button>
            )}
          </>
        )
      },
    },
  ]

  const isCollapsed = (index) => {
    return expandedRowKeys.includes(index + 1)
  }
  const onCollapsed = (index) => {
    if (isCollapsed(index)) {
      setExpandedRowKeys([])
      return
    }
    onExpandedRowsChange([index + 1])
  }
  const delColumnsFromCall = () => {
    let delsIndex = [1, 7, 8]
    delsIndex.forEach((one) => {
      columns.splice(one, 1)
    })
  }

  if (source == 'callSystem') {
    delColumnsFromCall()
  }

  useEffect(() => {
    async function fetchData() {
      let list = formateDataToTable()
      setData(list)
    }
    fetchData()
  }, [displaydetail.billList])

  const formateDataToTable = () => {
    let newBillList = []
    if (
      Array.isArray(displaydetail.billList) &&
      displaydetail.billList.length
    ) {
      for (var i = 0; i < displaydetail.billList.length; i++) {
        if (displaydetail.billList[i].subject == '总额') {
          newBillList.push(displaydetail.billList[i])
        }
      }
      if (source != 'callSystem') {
        for (var i = 0; i < newBillList.length; i++) {
          newBillList[i].children = []
          newBillList[i].key = i + 1
          for (var j = 0; j < displaydetail.billList.length; j++) {
            if (
              newBillList[i].term == displaydetail.billList[j].term &&
              displaydetail.billList[j].subject != '总额'
            ) {
              displaydetail.billList[j].key = Number(`${i + 1}${j}`)
              newBillList[i].children.push(displaydetail.billList[j])
            }
          }
        }
      }
    }
    return newBillList
  }

  const onExpandedRowsChange = (rows) => {
    console.log(rows)
    setExpandedRowKeys(rows)
  }
  return (
    <>
      {source != 'callSystem' && (
        <>
          <Row gutter={[0, 8]}>
            <Col span={8} className="repayRow">
              <span className="repayLabel">借款本金：</span>
              <span className="repayContent">
                {displaydetail.capitalAmount}
              </span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">逾期级别：</span>
              <span className="repayContent">{displaydetail.overdueType}</span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">开户银行：</span>
              <span className="repayContent">{displaydetail.bankName}</span>
            </Col>
          </Row>
          <Row gutter={[0, 8]}>
            <Col span={8} className="repayRow">
              <span className="repayLabel">实际放款：</span>
              <span className="repayContent">
                {displaydetail.realGetAmount}
              </span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">逾期天数：</span>
              <span className="repayContent">{displaydetail.overdueDay}</span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">银行账号：</span>
              <span className="repayContent">{displaydetail.cardNo}</span>
            </Col>
          </Row>
          <Row gutter={[0, 8]}>
            <Col span={8} className="repayRow">
              <span className="repayLabel">放款日期：</span>
              <span className="repayContent">{displaydetail.grantDate}</span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">应还总额：</span>
              <span className="repayContent">
                {displaydetail.payableAmount}
              </span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">已还总额：</span>
              <span className="repayContent">
                {displaydetail.repaymentAmount}
              </span>
            </Col>
          </Row>
          <Row gutter={[0, 8]}>
            <Col span={8} className="repayRow">
              <span className="repayLabel">剩余应还总额：</span>
              <span className="repayContent">
                {displaydetail.surplusPayableAmount}
              </span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">逾期剩余应还总利息：</span>
              <span className="repayContent">
                {displaydetail.surplusInterestAmount}
              </span>
            </Col>
            <Col span={8} className="repayRow">
              <span className="repayLabel">逾期剩余应还总本金：</span>
              <span className="repayContent">
                {displaydetail.surplusCapitalAmount}
              </span>
            </Col>
          </Row>
          <Row gutter={[0, 8]}>
            <Col span={8} className="repayRow">
              <span className="repayLabel">剩余应还总罚息：</span>
              <span className="repayContent">
                {displaydetail.surplusPenaltyAmount}
              </span>
            </Col>
          </Row>
        </>
      )}
      <Table
        dataSource={data}
        columns={columns}
        bordered
        pagination={false}
        expandedRowKeys={expandedRowKeys}
        expandable={{
          onExpandedRowsChange,
        }}
        scroll={{y: '100%', x: '100%'}}
        style={{marginTop: '20px'}}
      />
    </>
  )
}

export default RepayDetail
