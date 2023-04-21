import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Spin, message, Result } from 'antd';
import { FormInstance } from 'antd/lib/form';
import _ from 'lodash';
import Flag from './useFormItem/flag';
import Area from './useFormItem/area';
import { useImperativeHandle } from 'react';
import { getQueryPackageInfo } from '@/utils/api/formal';

/**
 * @description 分配职责下一步
 * @param props
 */
export interface ObligationFormNextChildProps<RecordType> {
  getFormVal: Function; //步骤操作
  nextData?: any; // 上次表单提交时的数据
  ldap: String; // 账号id
}

const ObligationFormNextChild = <RecordType extends object = any>(
  props: ObligationFormNextChildProps<RecordType>,
  ref,
) => {
  const { nextData, getFormVal, ldap } = props;
  const [spinning, setSpinning] = useState(true);
  const [queryPackage, setQueryPackage] = useState([]); //获取到的职责信息
  const [sendQueryPackage, setsendQueryPackage] = useState([]); // send数据
  const formRef = React.createRef<FormInstance>();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const gridStyle: Object = {
    width: '33.3333%',
    textAlign: 'left',
    height: 'auto',
    padding: '5px 0',
    lineHeight: 'auto',
    borderBottom: '1px solid #cccccc',
    paddingLeft: '5px',
  };
  const gridStyleHead: Object = {
    ...gridStyle,
    fontWeight: '500'
  };
  const gridStyleItem: Object = {
    ...gridStyle,
    color: '#676161',
    minHeight: '50px',
    borderBottom: '1px solid rgb(220 214 214)',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  useEffect(() => {
    let params = {
      ...nextData,
      dutyId: nextData.dutyId.value,
      ldap: ldap,
    };
    nextData.staffEmployeeGoodsTypeVOS && delete params.staffEmployeeGoodsTypeVOS;

    getQueryPackageInfo(params).then(res => {
      if (res && res.data) {
        //根据需求格式化出数据
        let sendData = [];
        res.data.map(item => {
          sendData.push({
            id: item.id,
            name: item.name,
            flags: [],
            area: {},
          });
        });
        setsendQueryPackage(sendData);
        setQueryPackage(res.data);
        setSpinning(false);
      } else {
        setSpinning(false);
        setQueryPackage([]);
        // message.error(res.errmsg);
      }
    });
  }, []);

  // 暴露内部方法
  useImperativeHandle(ref, () => ({
    formSubmit: () => {
      return formRef.current.submit();
    },
    // formReset: () => {
    //   return formRef.current.setFieldsValue({
    //     test: '',
    //     city: '',
    //     city2: ''
    //   });
    // }
  }));

  /**
   * @index 需要修改的对象,
   * @val value值
   * @key 修改对应key的属性值
   * @description 分配职责公共组件
   */
  const formChange = (index, val, key) => {
    console.log(`第${index}个系统的${key}为`, val);

    let params = sendQueryPackage;
    params[index][key] = val;
    setsendQueryPackage(params);
  };
  // 表单提交
  const formSubmit = () => {
    getFormVal(sendQueryPackage);
  };

  // useEffect(() => {
  //   let ele: Element = document.getElementsByClassName('obligationModal')[0].getElementsByClassName('ant-modal-body')[0] || null;
  //   var timeout = null
  //   let e = null;
  //   let watchScroll: any = function () {
  //     let scrollHeight = e.target.scrollHeight;
  //     let scrollTop = e.target.scrollTop;

  //     if (scrollTop + ele.clientHeight === scrollHeight && document && document.getElementsByClassName('footerButtons').length !== 0) {
  //       // console.log(document.getElementsByClassName('footerButtons'));
  //       document.getElementsByClassName('footerButtons')[0].getElementsByClassName('shadow')[0].style.display = 'none';
  //     } else {
  //       document.getElementsByClassName('footerButtons')[0].getElementsByClassName('shadow')[0].style.display = 'block';
  //     }
  //   }

  //   ele.onscroll = E => {
  //     e = E;
  //     if (timeout !== null) clearTimeout(timeout);
  //     timeout = setTimeout(watchScroll, 100);
  //   }
  // }, [])

  return (
    <Spin spinning={spinning} wrapperClassName="spinLoadingWrapper">
      {
        queryPackage.length !== 0 ?
          <p className={'ObligationFormNext_p'}>请确认职责基础权限，根据实际情况选择对应的仓库/地区噢！</p>
          :
          null
      }
      <Form
        className="ObligationFormNext"
        {...layout}
        ref={formRef}
        style={{ width: '100%' }}
        name="ObligationFormNxct"
        onFinish={formSubmit}
      >
        {
          queryPackage.length !== 0 ?
            queryPackage.map((item, index) => {
              return (
                <Card
                  key={item.id}
                  title={item.name}
                  size='small'
                  bordered={false}
                  style={{ marginBottom: '20px' }}
                  headStyle={{ background: 'rgb(218 213 213)' }}
                >
                  <Row>
                    <Col style={gridStyleHead}>权限类型</Col>
                    <Col style={gridStyleHead}>权限名称</Col>
                    <Col style={gridStyleHead}>自定义属性</Col>
                  </Row>


                  {/* 标志位处理 */}
                  {
                    item.flagInfo &&
                      (item.flagInfo.ownFlags !== null ||
                        !_.isEmpty(item.flagInfo.allFlags)) ?
                      <Flag
                        flagObject={item.flagInfo}
                        gridStyleItem={gridStyleItem}
                        callback={(val) => { formChange(index, val, 'flags') }}
                      />
                      :
                      null
                  }

                  {/* 地区处理 */}
                  {
                    item.areaInfo &&
                      (item.areaInfo.ownAreaInfo !== null ||
                        !_.isEmpty(item.areaInfo.businessList)) ?
                      <Area
                        areaObject={item.areaInfo}
                        gridStyleItem={gridStyleItem}
                        system={item}
                        callback={(val) => { formChange(index, val, 'area') }}
                      />
                      :
                      null
                  }

                  {/* 角色处理 */}
                  {
                    Array.isArray(item.roleInfos) && item.roleInfos.length !== 0 ?
                      item.roleInfos.map(resources => {
                        return (
                          <Row key={resources.id}>
                            <Col style={gridStyleItem}>
                              <li style={{ width: '100%' }}>角色</li>
                            </Col>
                            <Col style={gridStyleItem}>
                              <li style={{ width: '100%' }}>{resources.name || '-'}</li>
                            </Col>
                            <Col style={gridStyleItem}>
                              <li style={{ width: '100%' }}>-</li>
                            </Col>
                          </Row>
                        )
                      })
                      :
                      null
                  }

                  {/* 数据集逻辑处理 */}
                  {
                    Array.isArray(item.resourceInfos) && item.resourceInfos.length !== 0 ?
                      item.resourceInfos.map(resources => {
                        return (
                          <Row key={resources.id}>
                            <Col style={gridStyleItem}>
                              <li style={{ width: '100%' }}>{resources.resourceTypeName}</li>
                            </Col>
                            <Col style={gridStyleItem}>
                              <li style={{ width: '100%' }}>{resources.name}</li>
                            </Col>
                            <Col style={gridStyleItem}>
                              <li style={{ width: '100%' }}>{resources.identifying}</li>
                            </Col>
                          </Row>
                        )
                      })
                      :
                      null
                  }
                </Card>
              )

            })
            :
            !spinning ?
              <div>
                <Result
                  status="warning"
                  title="无相关权限包！"
                />
              </div>
              :
              null
        }
      </Form>
    </Spin>
  );
};

const ObligationFormNext = React.forwardRef(ObligationFormNextChild);
export default ObligationFormNext;
