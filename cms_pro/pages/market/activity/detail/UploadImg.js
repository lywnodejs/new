import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Upload, Button, message} from 'antd'

const UploadImage = ({
  defaultValue,
  value,
  imageType = ['image/png'],
  imageSize = 2,
  buttonTitle = '点击上传',
  buttonProps = {type: 'primary'},
  onChange,
}) => {
  const [imageUrl, setImageUrl] = useState(defaultValue)
  const [title, setTitle] = useState([])
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const customRequest = async (options) => {
    const imgBase64 = await getBase64(options.file)
    const imgTitle = await options.file.name
    setTitle(imgTitle)
    setImageUrl(imgBase64)
    if (typeof onChange === 'function') onChange(imgBase64)
  }

  const beforeUploadValidate = ({type, size}) => {
    const isLimitType = imageType.includes(type)
    if (!isLimitType) {
      const errorType = type && type.split('/')[1]
      message.error(`暂不支持上传 ${errorType ? errorType : '非图片'} 类型格式`)
      return false
    }
    const isLimitSize = size / 1024 / 1024 < imageSize
    if (!isLimitSize) {
      message.error(`图片大小需小于 ${imageSize} MB`)
      return false
    }
    return isLimitType && isLimitSize
  }

  const props = {
    customRequest: customRequest,
    showUploadList: false,
    beforeUpload: beforeUploadValidate,
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      {(imageUrl || value) && (
        <div>
          <img width={200} src={value ? value : imageUrl} />
          <p>{title}</p>
        </div>
      )}

      <Upload {...props}>
        <Button {...buttonProps} style={{marginLeft: 10}}>
          {buttonTitle}
        </Button>
      </Upload>
    </div>
  )
}

UploadImage.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  imageType: PropTypes.array,
  imageSize: PropTypes.number,
  buttonTitle: PropTypes.string || PropTypes.node,
  buttonProps: PropTypes.object,
  onChange: PropTypes.func,
}

export default UploadImage
