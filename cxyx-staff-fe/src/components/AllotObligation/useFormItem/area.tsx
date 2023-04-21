import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Form } from 'antd';
import { BusinessSelect, AreaSelect } from './Allselect';
import { getArea } from '@/utils/api/formal';
import _ from 'lodash';
/**
 * @description 分配职责地区
 */

export interface areaChildProps<RecordType> {
  areaObject: any; // 标识位对象
  gridStyleItem: Object; // 样式
  callback: Function; // 当前数据对应ID
  system: any; //当前系统id和name
}

const Area = <RecordType extends object = any>(
  props: areaChildProps<RecordType>,
) => {
  const { areaObject, gridStyleItem, system, callback } = props;
  const [formData, setFormData] = useState({
    business: {},
    areas: []
  });
  const [formSelectActive, setFormSelectActive] = useState(true); // 是否可以设置默认值（地区）
  const [businessList, setbusinessList] = useState([]); // 业务线数据
  const [areaList, setAreaList] = useState([]); // 地区数据
  const formRef: any = useRef();

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {

    //如果没有推荐，就设置默认值 (业务线)，同时设置地区下拉数据
    if (areaObject.ownAreaInfo === null && areaObject.businessList) {
      let business = [];
      if (areaObject.selectedBusiness && Object.keys(areaObject.selectedBusiness).length > 0) {
        // 默认的值可能不存在在 businessList中  需要判断添加进去
        areaObject.businessList.map(item => {
          if (item.id !== areaObject.selectedBusiness.id) {
            business.push(item)
          }
        })
        business.push(areaObject.selectedBusiness)
        // end
        let params = formData;
        params.business = areaObject.selectedBusiness;
        // params.areas = areaObject.selectedAreas;
        setAreaList(areaObject.areasTree || []) // 设置地区下拉树默认值
        setFormData(params);
        callback(params);
        // formRef.current.handleChange(() => {
        //   if (Array.isArray(areaObject.selectedAreas)) {
        //     return areaObject.selectedAreas.map(item => {
        //       return item.id
        //     })
        //   }
        // })
      } else {
        business = areaObject.businessList;
      }
      setbusinessList(business);
    }
    // //如果没有推荐，就设置默认值 (地区)
    // if (areaObject.ownAreaInfo && areaObject.ownAreaInfo.length === 0) {
    //   let params = formData;
    //   params.areas = areaObject.selectedAreas;
    //   setFormData(params);
    //   callback(params);
    // }


  }, [areaObject.businessList])


  // 业务线选择变化时请求地区数据
  const businessChange = (val) => {
    console.log('当前选择的业务线数据为', val);
    setFormSelectActive(false); //只要业务线变化过  就不给地区赋默认值
    let params = formData;
    if (val) {
      params.business = {
        id: val.value,
        name: val.label
      };
    } else {
      params.business = {};
    }

    params.areas = [];
    setFormData({ ...params });

    callback(params);
    if (!val) {
      return
    }
    // 请求地区数据
    let data = {
      appName: system.name,
      appId: system.id,
      businessId: val.value
    };

    formRef.current && formRef.current.clearData(); // 业务线改变之后  需要清空地区默认值

    getArea(data).then(res => {
      if (res.data && res.data.length !== 0) {
        setAreaList(res.data);
      } else {
        setAreaList([]);
      }
    });
  };

  // 地区选择变化
  const areaChange = (val) => {
    console.log('地区数据变化为', val);
    let params = formData;
    params.areas = val;
    setFormData(params);
    callback(params);
  };
  return (
    <Row>
      <Col style={gridStyleItem}>地区</Col>
      <Col style={gridStyleItem}>
        {
          // 如果有自带业务线 ：没有业务线需要选择
          Array.isArray(areaObject.ownAreaInfo) &&
            areaObject.ownAreaInfo.length !== 0 ?
            areaObject.ownAreaInfo.map(item => {
              return (
                <li style={{ width: '100%' }} key={item.id}>业务线：{item.name}</li>
              )
            })

            :
            <Form.Item
              style={{ width: '100%' }}
              label='业务线'
            >
              <BusinessSelect
                dataList={businessList}
                selectChange={(val) => { businessChange(val) }}
                defaultValue={() => {
                  if (areaObject.selectedBusiness) {
                    return {
                      lable: areaObject.selectedBusiness.name,
                      value: areaObject.selectedBusiness.id
                    }
                  }
                }}
              />
            </Form.Item>
        }
      </Col>
      <Col style={gridStyleItem}>
        {//业务线需要选择地区

          Array.isArray(areaObject.ownAreaInfo) &&
            areaObject.ownAreaInfo.length !== 0 ?

            areaObject.ownAreaInfo.map(item => {
              if (item.packageAreaList && item.packageAreaList.length !== 0) {
                return item.packageAreaList.map(arr => {
                  return (
                    <li style={{ width: '100%' }} key={item.businessId + arr.id}>地区：{arr.name}</li>
                  )
                })
              } else {
                return (
                  <li style={{ width: '100%' }} key={item.businessId}>-</li>
                )
              }
            })
            :
            !_.isEmpty(formData.business) ?

              <Form.Item
                style={{ width: '100%' }}
                label='地区'
                name={system.id}
                rules={[{ required: true, message: '请选择地区' }]}
                validateTrigger={'shbmit'}
              >
                <AreaSelect
                  dataList={areaList}
                  ref={formRef}
                  selectChange={(val) => { areaChange(val) }}
                  useDefaultValue={() => {
                    if (Array.isArray(areaObject.selectedAreas) && formSelectActive) {
                      return areaObject.selectedAreas.map(item => {
                        return item.id
                      })
                    }
                  }}
                />
              </Form.Item>
              :
              '-'
        }
      </Col>
    </Row >
  )
}


// const Flag = React.forwardRef(flagChild)

export default Area;
