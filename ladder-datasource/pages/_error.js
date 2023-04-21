import React from 'react'
import {Result, Button} from 'antd'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

const error = {
  '403': '抱歉，您无权访问此页面。',
  '404': '抱歉，您访问的页面不存在。',
  '500': '抱歉，服务器错误。',
}
const Error = ({statusCode}) => {
  const router = useRouter()
  const code = router.query.statusCode || statusCode
  return (
    <Result
      style={{minHeight: 'calc(100% - 72px)'}}
      status={code}
      title={code}
      subTitle={error[code]}
      extra={
        code != 500 && (
          <Button
            type="primary"
            onClick={() => {
              router.push('/')
            }}
          >
            Back Home
          </Button>
        )
      }
    />
  )
}

Error.getInitialProps = async ({ctx: {res, err}}) => {
  let statusCode = null
  if (res) {
    ;({statusCode} = res)
  } else if (err) {
    ;({statusCode} = err)
  }
  return {
    statusCode,
    isError: true,
  }
}

Error.defaultProps = {
  statusCode: null,
}

Error.propTypes = {
  statusCode: PropTypes.number,
}

export default Error
