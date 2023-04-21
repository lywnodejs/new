import React, { useEffect, useState } from 'react';
import FormSearch from './EasySearch';
import { Card, Tooltip, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import EasyList from './EasyList';
import style from './style.less';
import {
  getTableParams,
  addTableParams,
  watchTableParams,
  getHiddenColumn,
} from './EasyParamStore';
import _ from 'lodash';
import DiyColumnModal from './DiyColumnModal';

export interface EasyTableProps<RecordType> {
  name: string;
  columns: any;
  searchColumns?: any; // 搜索项
  searchColCount?: number;
  paginationProps?: object;
  pagination?: false | TablePaginationConfig;
  fetchData: {
    api: Function;
    dataField?: string;
    totalField?: string;
    pageField?: string;
    sizeField?: string;
  };
  middleContent?: React.ReactNode;
  customStyle?: {
    EasyMainClass?: string;
    SearchCardClass?: string;
    TableCardClass?: string;
    EasyMainStyle?: object;
    SearchCardStyle?: object;
    TableCardStyle?: object;
    DiyColumnButton?: string;
  };
  formProps?: any;
  tableProps?: any;
  formButtons?: any;
  onFormRef?: any;
  needFirstRequest?: boolean;
  showDiyButton?: any;
  showForm?: boolean;
  showTable?: boolean;
  autoMerge?: boolean; // 是否自动合并列
}

const EasyTable = <RecordType extends object = any>(
  props: EasyTableProps<any>,
) => {
  const [dataList, setDataList] = useState<any>();
  const [diyColumns, setDiyColumns] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>();
  const [diyModalVisible, setDiyModalVisible] = useState<boolean>(false);
  const [formRef, setFormRef] = useState<any>();
  const [pageNum, setPageNum] = useState<any>({ current: 1, total: 0 });
  const {
    showDiyButton = false,
    showForm = true,
    showTable = true,
    autoMerge = false,
    needFirstRequest = true,
  } = props;

  useEffect(() => {
    if (formRef && formRef.current) {
      const params = getTableParams(props.name);
      formRef.current.getForm().setFieldsValue(params);
      typeof props.onFormRef === 'function' && props.onFormRef(formRef);
    }
  }, [formRef]);

  useEffect(() => {
    watchTableParams(params => {
      fetchListData(params);
    }, props.name);
    needFirstRequest && addTableParams({}, props.name);
  }, []);

  useEffect(() => {
    setDiyColumns(getHiddenColumn(props.columns, props.name));
  }, [props.columns]);

  const handleSearch = values => {
    addTableParams({ ...values, page: 1 }, props.name);
  };

  const handlePageChange = params => {
    addTableParams({ page: params.current, size: params.pageSize }, props.name);
  };

  const handleReset = () => {
    if (formRef) {
      formRef.current.getForm().resetFields();
      const values = formRef.current.getForm().getFieldsValue();
      addTableParams(values, props.name);
    }
  };

  const fetchListData = params => {
    setLoading(true);
    const api = _.get(props, 'fetchData.api');
    const dataField = _.get(props, 'fetchData.dataField', 'data.list');
    const totalField = _.get(props, 'fetchData.totalField', 'data.total');
    const pageField = _.get(props, 'fetchData.pageField', 'page');
    const sizeField = _.get(props, 'fetchData.sizeField', 'size');
    const searchParams = {
      ..._.omit(params, ['page', 'size']),
      [pageField]: params.page,
      [sizeField]: params.size,
    };
    api &&
      api(searchParams)
        ?.then(res => {
          if (res) {
            const dataList = _.get(res, dataField, []);
            setPageNum({
              current: _.get(params, 'page', 1),
              total: _.get(res, totalField, '-'),
              pageSize: _.get(params, 'size', 10),
            });
            !_.get(props, 'tableProps.rowKey') &&
              dataList &&
              dataList.forEach((item, index) => {
                item.key = index;
              });
            setDataList(dataList);
          }
        })
        .finally(() => {
          setLoading(false);
        });
  };

  const DiyColumnButton = (
    <Tooltip
      title="自定义表格的展示列"
      className={_.get(
        props,
        'customStyle.DiyColumnButton',
        style.DiyColumnButton,
      )}
    >
      <Button
        icon={<SettingOutlined />}
        size={'small'}
        shape="circle"
        onClick={() => setDiyModalVisible(true)}
      />
    </Tooltip>
  );

  return (
    <div
      className={_.get(props, 'customStyle.EasyMainClass', style.EasyMain)}
      style={_.get(props, 'customStyle.EasyMainStyle')}
    >
      {showForm && (
        <Card
          className={_.get(
            props,
            'customStyle.SearchCardClass',
            style.SearchCard,
          )}
          style={_.get(props, 'customStyle.SearchCardStyle')}
        >
          <FormSearch
            formProps={props.formProps}
            formButtons={props.formButtons}
            searchColCount={props.searchColCount}
            handleSearch={handleSearch}
            onRef={ref => setFormRef(ref)}
            handleReset={handleReset}
            columns={props.columns}
            searchColumns={props.searchColumns}
          />
        </Card>
      )}
      <Card
        className={_.get(props, 'customStyle.TableCardClass', style.TableCard)}
        style={_.get(props, 'customStyle.TableCardStyle')}
      >
        {props.middleContent}
        {showDiyButton &&
          (typeof showDiyButton === 'function'
            ? showDiyButton({
                DiyColumnButton,
                showDiyColumnModal: setDiyModalVisible,
              })
            : DiyColumnButton)}
        {showTable && (
          <EasyList
            columns={diyColumns.filter(item => !item.hidden)}
            loading={loading}
            data={dataList}
            pageNum={pageNum}
            pagination={props.pagination}
            change={handlePageChange}
            tableProps={props.tableProps}
            autoMerge={autoMerge}
          />
        )}
      </Card>
      <DiyColumnModal
        tableName={props.name}
        columnChange={columns => {
          setDiyColumns([...columns]);
        }}
        diyColumns={diyColumns}
        isModalVisible={diyModalVisible}
        closeModal={() => setDiyModalVisible(false)}
      />
    </div>
  );
};

export default EasyTable;
