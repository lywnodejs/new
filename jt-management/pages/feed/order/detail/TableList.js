import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import Carousel, {Modal as ImageModal, ModalGateway} from 'react-images'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({list, isHasMore, userId}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [previewImgs, setPreviewImgs] = useState([])

  const columns = [
    {
      title: '属性',
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: 150,
    },
    {
      title: '值',
      dataIndex: 'attributeValue',
      key: 'attributeValue',
      width: 150,
      render: (text, record, index) => {
        return record.isLink ? (
          <Button type="link" onClick={() => check(text)}>
            查看{isHasMore ? '更多' : '照片'}
          </Button>
        ) : (
          text
        )
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
  ]
  const check = (param) => {
    if (!isHasMore) {
      checkImg(param)
      return
    }
    let url = `/feed/order/form?userId=${userId}&tag=contacts`
    Router.push(url)
  }
  const checkImg = (img) => {
    toggleModal()
    setPreviewImgs([{src: img}])
  }

  const toggleModal = () => {
    setModalIsOpen((modalIsOpen) => !modalIsOpen)
  }
  const Footer = ({currentView, modalProps}) => {
    return null
  }
  return (
    <>
      <Table
        rowKey="id"
        dataSource={list}
        columns={columns}
        bordered
        pagination={false}
        scroll={{y: '100%', x: '100%'}}
      />
      <ModalGateway>
        {modalIsOpen ? (
          <ImageModal onClose={toggleModal}>
            <Carousel views={previewImgs} components={{Footer}} />
          </ImageModal>
        ) : null}
      </ModalGateway>
    </>
  )
}

export default TableList
