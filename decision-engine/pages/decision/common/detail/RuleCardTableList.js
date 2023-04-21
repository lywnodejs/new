import React, {useEffect, useState} from 'react'
import {PlusCircleOutlined, MinusCircleOutlined} from '@ant-design/icons'
import {Table, Input, Row, Col} from 'antd'
import ScriptSourceDetailModal from '../ScriptSourceDetailModal'

const RuleSetTableList = ({
  list,
  appendToRuleIds,
  setList,
  onOpenRuleEditModal,
  onOpenRuleEditModalForCondition,
  ruleIds,
  partialPro,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [data, setData] = useState([])
  const [scriptSourceVisible, setScriptSourceVisible] = useState(false)
  const [scriptSource, setScriptSource] = useState('')

  useEffect(() => {
    function fetchData() {
      Array.isArray(list.scoreRuleGroupList) &&
        list.scoreRuleGroupList.length &&
        list.scoreRuleGroupList.forEach((one, index) => {
          one.index = index
          one.key = String(one.index)
        })

      list.scoreRuleGroupList = list.scoreRuleGroupList
        ? [...list.scoreRuleGroupList]
        : []
      setData(list.scoreRuleGroupList)
    }
    fetchData()
  }, [list])

  useEffect(() => {
    function fetchData() {
      if (!ruleIds.length) {
        setSelectedRowKeys([])
      }
    }
    fetchData()
  }, [ruleIds])

  const rowSelection = {
    selectedRowKeys,
    // fixed: 'left',
    onChange: (v, row) => {
      let keys = []
      if (Array.isArray(row) && row.length) {
        keys = row.map((item) => item.index)
      }

      setSelectedRowKeys(v)
      appendToRuleIds(keys)
    },
  }
  const onAddCondition = (item, index) => {
    list.scoreRuleGroupList[index].scoreRuleList.unshift({
      id: '',
      scoreRuleGroupId: item.id,
      score: 0,
      scriptSource: '',
      others: 0,
      fieldList: [],
    })
    setData([...list.scoreRuleGroupList])
  }
  const onDeleteCondition = (index, j) => {
    list.scoreRuleGroupList[index].scoreRuleList.splice(j, 1)
    setData([...list.scoreRuleGroupList])
  }
  const onDeleteScore = (item, index) => {
    list.scoreRuleGroupList.splice(index, 1)
    setData([...list.scoreRuleGroupList])
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'seqNum',
      key: 'seqNum',
      width: 38,
      render: (text, record, index) => {
        return index + 1
      },
    },
    {
      title: '编码',
      dataIndex: 'scoreRuleGroupCode',
      key: 'scoreRuleGroupCode',
      width: 110,
      render: (text, record, index) => {
        return (
          <Row gutter={[0, 16]}>
            <Col span={24}>
              {!partialPro ? (
                <Input
                  value={text}
                  onChange={(e) => {
                    record.scoreRuleGroupCode = e.target.value
                    setList({...list})
                  }}
                />
              ) : (
                text
              )}
            </Col>
          </Row>
        )
      },
    },
    {
      title: '评分维度',
      dataIndex: 'scriptSource',
      key: 'scriptSource',
      width: 200,
      render: (text, record, index) => {
        return (
          <Row gutter={[0, 16]}>
            <Col span={18}>
              <Input
                disabled={partialPro}
                value={text}
                onClick={() => onOpenRuleEditModal({...record, i: index})}
              />
            </Col>
            {!partialPro && (
              <Col span={6} style={{lineHeight: '30px'}}>
                <PlusCircleOutlined
                  onClick={() => onAddCondition(record, index)}
                  style={{marginRight: '6px'}}
                />
                <MinusCircleOutlined
                  onClick={() => onDeleteScore(record, index)}
                />
              </Col>
            )}
          </Row>
        )
      },
    },
    {
      title: '条件',
      dataIndex: 'scoreRuleList',
      key: 'scoreRuleList',
      width: 200,
      render: (text, record, index) => {
        return text.map((item, i) => (
          <Row key={i} gutter={[0, 16]}>
            <Col span={20}>
              {!partialPro ? (
                <Input
                  value={item.scriptSource}
                  onClick={() =>
                    onOpenRuleEditModalForCondition({
                      ...item,
                      i: index,
                      j: i,
                      scoreRuleGroupCode: record.scoreRuleGroupCode,
                    })
                  }
                  disabled={text.length - 1 == i || partialPro}
                />
              ) : (
                <span
                  onClick={() => onShowAllScriptSource(item.scriptSource)}
                  style={{color: '#1890ff', cursor: 'pointer'}}
                >
                  {item.scriptSource}
                </span>
              )}
            </Col>
            {!partialPro && (
              <Col span={4} style={{lineHeight: '30px'}}>
                {text.length - 1 != i ? (
                  <MinusCircleOutlined
                    onClick={() => onDeleteCondition(index, i)}
                  />
                ) : null}
              </Col>
            )}
          </Row>
        ))
      },
    },
    {
      title: '评分',
      dataIndex: 'scoreRuleList',
      key: 'score',
      width: 100,
      render: (text, record, index) => {
        return text.map((item, i) => (
          <Row key={i} gutter={[0, 16]}>
            <Col span={24}>
              <Input
                disabled={partialPro}
                value={item.score}
                onChange={(e) => {
                  item.score = e.target.value
                  setList({...list})
                }}
              />
            </Col>
          </Row>
        ))
      },
    },
  ]

  const onShowAllScriptSource = (scriptSource) => {
    setScriptSourceVisible(true)
    setScriptSource(scriptSource)
  }

  return (
    <>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        bordered
        pagination={false}
        rowSelection={!partialPro ? rowSelection : null}
        scroll={{y: '100%', x: '100%'}}
      />
      <ScriptSourceDetailModal
        {...{
          scriptSource,
          visible: scriptSourceVisible,
          onHide: () => setScriptSourceVisible(false),
        }}
      />
    </>
  )
}

export default RuleSetTableList
