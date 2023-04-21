import React, {useEffect, useState} from 'react'
import {PlusCircleOutlined, MinusCircleOutlined} from '@ant-design/icons'
import {Table, Input, Row, Col} from 'antd'
import ScriptSourceDetailModal from '../ScriptSourceDetailModal'

const RuleSetTableList = ({
  list,
  partialPro,
  setList,
  onOpenRuleColModal,
  onOpenRuleRowModal,
}) => {
  const [data, setData] = useState({})
  const [scriptSourceVisible, setScriptSourceVisible] = useState(false)
  const [scriptSource, setScriptSource] = useState('')

  useEffect(() => {
    function fetchData() {
      setData({...list})
    }
    fetchData()
  }, [list])

  const downSelect = (currentPageData) => {
    return (
      <>
        行
        {!partialPro && (
          <>
            :
            <PlusCircleOutlined onClick={() => onAddRow()} />
          </>
        )}
        列
        {!partialPro && (
          <>
            :
            <PlusCircleOutlined onClick={() => onAddCol()} />
          </>
        )}
      </>
    )
  }
  const downInput = (one, index) => {
    return (
      <>
        <Row>
          <Col span={20}>
            {!partialPro ? (
              <Input
                value={one.scriptSource}
                disabled={data.xDimensionRuleList.length - 1 == index}
                onClick={() => onOpenRuleColModal({...one, i: index})}
              />
            ) : one.scriptSource != '其他' ? (
              <span
                onClick={() => onShowAllScriptSource(one.scriptSource)}
                style={{color: '#1890ff', cursor: 'pointer'}}
              >
                {one.scriptSource}
              </span>
            ) : (
              one.scriptSource
            )}
          </Col>
          <Col span={4} style={{lineHeight: '30px'}}>
            {data.xDimensionRuleList.length - 1 != index && !partialPro ? (
              <>
                <PlusCircleOutlined
                  onClick={() => onAddRightCol(one, index)}
                  style={{marginRight: '6px'}}
                />
                <MinusCircleOutlined onClick={() => onDeleteCol(one, index)} />
              </>
            ) : null}
          </Col>
        </Row>
      </>
    )
  }
  const onAddRightCol = (x, index) => {
    list.xDimensionRuleList.splice(index + 1, 0, {
      scriptSource: '',
      id: '',
      others: 0,
      fieldList: [],
    })
    for (var i = 0; i < list.yDimensionRuleList.length; i++) {
      list.yDimensionRuleList[i].valueList.splice(index + 1, 0, '')
    }
    setData({...list})
  }
  const onDeleteCol = (x, index) => {
    list.xDimensionRuleList.splice(index, 1)
    for (var i = 0; i < list.yDimensionRuleList.length; i++) {
      list.yDimensionRuleList[i].valueList.splice(index, 1)
    }
    setData({...list})
  }
  const columns = [
    {
      title: downSelect(),
      dataIndex: 'scriptSource',
      key: 'scriptSource',
      width: 260,
      // fixed: 'left',
      render: (text, record, index) => {
        return (
          <Row>
            <Col span={20}>
              {!partialPro ? (
                <Input
                  value={text}
                  disabled={data.yDimensionRuleList.length - 1 == index}
                  onClick={() => onOpenRuleRowModal({...record, i: index})}
                />
              ) : text != '其他' ? (
                <span
                  onClick={() => onShowAllScriptSource(text)}
                  style={{color: '#1890ff', cursor: 'pointer'}}
                >
                  {text}
                </span>
              ) : (
                text
              )}
            </Col>
            <Col span={4} style={{lineHeight: '30px'}}>
              {data.yDimensionRuleList.length - 1 != index && !partialPro ? (
                <>
                  <PlusCircleOutlined
                    onClick={() => onAddBottomRow(index)}
                    style={{marginRight: '6px'}}
                  />
                  <MinusCircleOutlined onClick={() => onDeleteRow(index)} />
                </>
              ) : null}
            </Col>
          </Row>
        )
      },
    },
  ]
  const onAddBottomRow = (index) => {
    list.yDimensionRuleList.splice(index + 1, 0, {
      scriptSource: '',
      id: '',
      others: 0,
      fieldList: [],
      valueList: [],
    })
    for (var i = 0; i < list.xDimensionRuleList.length; i++) {
      list.yDimensionRuleList[index + 1].valueList.splice(index + 1, 0, '')
    }
    setData({...list})
  }
  const onAddRow = () => {
    list.yDimensionRuleList =
      list.yDimensionRuleList == null ? [] : list.yDimensionRuleList
    list.yDimensionRuleList.unshift({
      scriptSource: '',
      id: '',
      others: 0,
      fieldList: [],
      valueList: [],
    })
    for (var i = 0; i < list.xDimensionRuleList.length; i++) {
      list.yDimensionRuleList[0].valueList.unshift('')
    }
    setData({...list})
  }
  const onAddCol = () => {
    list.xDimensionRuleList.unshift({
      scriptSource: '',
      id: '',
      others: 0,
      fieldList: [],
    })
    for (var i = 0; i < list.yDimensionRuleList.length; i++) {
      list.yDimensionRuleList[i].valueList.unshift('')
    }
    setData({...list})
  }
  const onDeleteRow = (index) => {
    list.yDimensionRuleList.splice(index, 1)
    setData({...list})
  }
  const others =
    Array.isArray(data.xDimensionRuleList) && data.xDimensionRuleList.length
      ? data.xDimensionRuleList.map((one, index) => {
          return {
            title: downInput(one, index),
            dataIndex: 'valueList',
            key: 'valueList',
            width: 260,
            render: (text, record, i) => {
              return (
                <Input
                  value={text[index]}
                  disabled={partialPro}
                  onChange={(e) => {
                    list.yDimensionRuleList[i].valueList[index] = e.target.value
                    setList({...list})
                  }}
                />
              )
            },
          }
        })
      : []
  const mergeColumns = [...columns, ...others]
  const onShowAllScriptSource = (scriptSource) => {
    setScriptSourceVisible(true)
    setScriptSource(scriptSource)
  }
  return (
    <div className="matrixTable">
      <Table
        rowKey="id"
        dataSource={
          data.yDimensionRuleList
            ? [...data.yDimensionRuleList]
            : data.yDimensionRuleList
        }
        columns={mergeColumns}
        bordered
        pagination={false}
        scroll={{y: '100%', x: '100%'}}
      />
      <ScriptSourceDetailModal
        {...{
          scriptSource,
          visible: scriptSourceVisible,
          onHide: () => setScriptSourceVisible(false),
        }}
      />
    </div>
  )
}

export default RuleSetTableList
