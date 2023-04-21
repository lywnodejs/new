/**
 * 查询 Redis 缓存和清除缓存功能
 * @author lizhenghua
 * @date 2018-08-16 15:46:52
 */

import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Modal, Card, Table } from 'antd';

const FormItem = Form.Item;
const { Column } = Table;
const TableStyle = {
  buttonSize: 'small'
};
const confirm = Modal.confirm;
const { TextArea } = Input;

class CacheTool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key: '',
      modalVisble: false,
      editValue: null
    };
  }
  
  handleKeyChange(e) {
    this.setState({
      ...this.state,
      key: e.target.value
    });
  }
  
  search() {
    this.props.dispatch({
      type: 'manageTools/search',
      payload: {
        key: this.state.key
      }
    });
  }

  edit(record) {
    this.setState({
      ...this.state,
      modalVisble: true,
      editValue: record.data
    });
  }

  handleChange(value) {
    this.setState({
      ...this.state,
      editValue: value
    });
  }

  handleOk() {
    this.props.dispatch({
      type: 'manageTools/edit',
      payload: {
        key: this.state.key,
        cacheValue: this.state.editValue
      }
    }).then(() => {
      this.setState({
        ...this.state,
        modalVisble: false
      });
      this.search();
    });
  }

  handleCancel() {
    this.setState({
      ...this.state,
      modalVisble: false
    });
  }

  remove(record) {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props.dispatch({
          type: 'manageTools/delete',
          payload: {
            key: this.state.key
          }
        }).then(() => this.search());
      }
    });
  };

  render() {
    const { t } = this.props;
    // 暂时不支持数组
    // const { records: datas, current, size: pageSize, total } = this.props.datalists;
    const { listdatas } = this.props.listdatas;
    return (
      <Card title={t('清理缓存')}>
        <Row gutter={24}>
          <Col span={8} className="search-fields">
            <FormItem label={t('key')} >
              <Input onChange={(value) => this.handleKeyChange(value)}/>
            </FormItem>
          </Col>
          <Col span={3} className="search-button">
            <FormItem label="">
              <Button
                type="primary"
                onClick={() => this.search()}>
                {t('搜索')}
              </Button>
            </FormItem>
            
          </Col>
        </Row>

        <Table className="upm-table tool-table"
          dataSource={listdatas}
          rowKey="data"
        >
          <Column title={t('信息')} dataIndex="data" style={{wordBreak: 'break-all'}}/>
          <Column
            title={t('操作')}
            width={150}
            key="action"
            render={(text, record) => {
              return (
                <span>
                  <Button type="primary"
                    size={TableStyle.buttonSize}
                    onClick={() => this.edit(record)}
                  >
                    {t('编辑')}
                  </Button>
                  <Button type="danger"
                    size={TableStyle.buttonSize}
                    onClick={() => this.remove(record)}
                  >
                    {t('删除')}
                  </Button>
                </span>
              );
            }}
          />
        </Table>
        <Modal
          title={t('编辑')}
          visible={this.state.modalVisble}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >
          <TextArea
            rows={4}
            value={this.state.editValue}
            onChange={(e) => this.handleChange(e.target.value)}
          />
        </Modal>
      </Card>
    )
  }
}

export default connect(({ manageTools }) => {
  return {
    listdatas: manageTools.listdatas
  };
})(CacheTool);