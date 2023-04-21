import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from 'react'
import {Row, Col, Button} from 'antd'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import styles from './index.less'
const Context = React.createContext()

function JsonValue(props) {
  const rootClassName = props.keyName === 'root' ? styles.rootTag : ''
  const rootClass = props.keyName === 'root' ? styles.rootClass : ''
  const stringClassName = props.type === 'String' ? styles.stringTag : ''
  const textIndent = props.textIndent || 20
  const value = useContext(Context)

  const Comma = () => {
    return props.keyName !== 'root' && ','
  }

  return (
    <span
      className={`${stringClassName} ${props.className} ${rootClass} `}
      style={{textIndent: props.textIndent}}
    >
      {props.type === 'String' && (
        <React.Fragment>
          "{props.value + ''}"
          <Comma />
        </React.Fragment>
      )}
      {props.type === 'Object' && (
        <span
          style={{
            textIndent: props.keyName !== 'root' ? textIndent : 'inherit',
          }}
        >
          <div
            className={rootClassName}
            onClick={() => value.clickKey({keyName: 'root'})}
          >
            {'{'}
          </div>

          <span style={{textIndent: textIndent + 5}}>
            {props.value.map((item, index) => {
              return (
                <div key={item.parentSuccess + (index + '')}>
                  <span>
                    <a
                      onClick={() => value.clickKey(item)}
                      className={`
                           ${item.selected ? styles.selectedKey : ''} 
                           ${item.searched ? styles.searchedKey : ''}
                           `}
                    >
                      {`"${item.keyName}" `}
                    </a>
                    :&nbsp;
                  </span>
                  <span style={{wordBreak: 'break-all'}}>
                    <JsonValue textIndent={textIndent + 10} {...item} />
                  </span>
                </div>
              )
            })}
          </span>
          <div className={rootClassName}>
            {'}'}
            <Comma />
          </div>
        </span>
      )}
      {props.type === 'Array' && (
        <span>
          <span>[</span>
          <span style={{textIndent}}>
            {props.value.map((item, index) => {
              return (
                <React.Fragment key={item.parentSuccess + (index + '')}>
                  <JsonValue
                    {...item}
                    textIndent={textIndent + 5}
                    className={styles.arrChild}
                  />
                </React.Fragment>
              )
            })}
          </span>
          <div>
            ] <Comma />
          </div>
        </span>
      )}
    </span>
  )
}

function Index(props, ref) {
  const [json, setJson] = useState(props.data)
  
  const [tempJson, setTempJson] = useState([])
  const [readOnly] = useState(
    typeof props.readOnly === 'undefined' ? true : props.readOnly,
  )

  let [selectKeys, setSelect] = useState([])

  const inputEl = useRef(null)

  useEffect(() => {
    if (json) {
      let keys = Object.keys(json)
      let tempArr = []
      keys.forEach((key, index) => {
        json2ele(tempArr, key, index, json[key])
      })

      let obj = {
        keyName: 'root',
        value: tempArr,
        type: 'Object',
      }
      setTempJson(obj)
    }
  }, [json, props.selecteds])

  useEffect(() => {
    setJson(props.data)
  }, [props.data])


  const json2ele = (
    parentArray,
    key,
    index,
    value,
    parent,
    parentSuccess,
    parentType,
  ) => {
    let type = Object.prototype.toString.call(value).slice(8, -1)
    let keyExp =
      parentType === 'Array' ? parent || '' : parent ? parent + '.' + key : key

    let selecteds = props.selecteds || []
    let selected = selecteds.find((v) => v.columnPath == keyExp)

    let keyExpSuccess =
      parentType === 'Array'
        ? `${parentSuccess}[${index}]`
        : parentSuccess
        ? parentSuccess + '.' + key
        : key
    parentArray[index] = {
      keyName: key,
      value: [],
      keyExp,
      keyExpSuccess,
      type,
      selected: !!selected,
    }

    if (type === 'Array') {
      value.forEach((item, aIndex) => {
        json2ele(
          parentArray[index].value,
          index,
          aIndex,
          item,
          keyExp,
          keyExpSuccess,
          type,
        )
      })
    } else if (type === 'Object') {
      let keys = Object.keys(value)
      keys.forEach((nKey, nIndex) => {
        json2ele(
          parentArray[index].value,
          nKey,
          nIndex,
          value[nKey],
          keyExp,
          keyExpSuccess,
          type,
        )
      })
    } else {
      parentArray[index].value = value
      parentArray[index].type = 'String'
    }

    if (!!selected) {
      clickKey({...parentArray[index], ...selected}, 'init')
    }
  }

  const clickKey = (item, clickType) => {
    if (readOnly) {
      return
    }
    let result = {
      ...item,
      keyName: item.keyName,
      keyExp: item.keyName === 'root' ? 'root' : item.keyExp,
    }

    if (item.keyName !== 'root') {
      // console.log(json)
      // console.log(item)
      // console.log(json[item.keyExpSuccess])
      // return
      // result.value = eval(`json.${item.keyExpSuccess}`)
      result.value = item.value
      result.keyExpSuccess = item.keyExpSuccess
    } else {
      result.columnType = 'object'
    }

    const index = selectKeys.findIndex((v) => v.keyExp === result.keyExp)
    if (index === -1) {
      // 添加选择状态
      let index = 0
      selectKeys.unshift(result)
      // if (item.keyName === 'root') {
      //   index = 0
      //   selectKeys.unshift(result)
      // } else {
      //   selectKeys.unshift(result)
      //   index = selectKeys.length - 1
      // }

      let tempObj = {...tempJson}
      selectKey(tempObj, result, 'selected', true)
      setTempJson(tempObj)
      changeSelect(index, clickType)
    }
  }

  const selectKey = (tempObj, item, type, status = false) => {
    if (item.keyName === 'root') {
      tempObj[type] = status
    } else {
      Array.isArray(tempObj.value) &&
        tempObj.value.forEach((v) => {
          if (
            (type === 'selected' && v.keyExp === item.keyExp) ||
            (type === 'searched' &&
              typeof v.keyName == 'string' &&
              !!item.keyName.trim() &&
              v.keyName.indexOf(item.keyName) > -1)
          ) {
            v[type] = status
          } else {
            if (type === 'searched') {
              v[type] = false
            }
            selectKey(v, item, type, status)
          }
        })
    }
  }

  const searchKey = () => {
    const key = inputEl.current.value
    let tempObj = {...tempJson}
    selectKey(tempObj, {keyName: key}, 'searched', true)
    setTempJson(tempObj)
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      searchKey()
    }
  }

  const changeSelect = (index, type) => {
    if (typeof props.changeSelect === 'function') {
      props.changeSelect(selectKeys, index, type)
    }
  }

  useImperativeHandle(ref, () => {
    let methods = {
      deleteAll: () => {
        selectKeys.forEach((item, index) => {
          methods.deleteKey(item, index, true)
        })
        selectKeys.splice(0, selectKeys.length)
        changeSelect()
      },
      deleteKey: (item, index, isAll = false) => {
        let tempObj = {...tempJson}
        const delIndex =
          index === undefined
            ? selectKeys.findIndex((v) => v.keyExp === item.keyExp)
            : index
        selectKey(tempObj, item, 'selected', false)
        setTempJson(tempObj)
        if (!isAll) {
          selectKeys.splice(delIndex, 1)
          changeSelect()
        }
      },
    }
    return methods
  })

  return (
    <Context.Provider
      value={{
        clickKey,
        selecteds: props.selecteds,
      }}
    >
      <div
            className={`${styles.jsonTreeBox} ${
              readOnly ? styles.jsonTreeBoxRead : ''
            }  ${props.canSearch ? styles.jsonTreeBoxCanSearch : ''}`}
          >
            {(!readOnly || props.canSearch) && (
              <div className={styles.header}>
                {!props.canSearch && (
                  <Row style={{marginBottom: 10}}>
                    <Col span={12} style={{fontSize: 14, color: '#333'}}>
                      {props.dataName}
                    </Col>
                    <Col
                      span={12}
                      style={{textAlign: 'right', fontSize: 12, color: '#666'}}
                    >
                      已添加<a>&nbsp;{selectKeys.length}&nbsp;</a>个
                    </Col>
                  </Row>
                )}
                <div className={styles.searchBox}>
                  <input type="text" ref={inputEl} onKeyDown={onKeyDown} />
                  <button className={styles.searchBoxBtn} onClick={searchKey}>搜索</button>
                  {
                    props.toggleCollapsed ? (
                      <Button
                        type="primary"
                        onClick={props.toggleCollapsed}
                        style={{marginLeft: 16}}
                      >
                        <MenuFoldOutlined />
                      </Button>
                    ) : null
                  }
                </div>
              </div>
            )}

            <JsonValue {...tempJson} clickKey={clickKey} />
          </div>
        
    </Context.Provider>
  )
}

export default React.forwardRef(Index)
