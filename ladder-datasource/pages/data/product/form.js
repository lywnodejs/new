import {Button, Space, message} from 'antd'
import {useState, useEffect, useRef} from 'react'
import {Layout} from '~/components/Layout'
import fetch from '~/utils/fetch'
import {useRouter} from 'next/router'

function body({doc}) {
  const [breadcrumbs, setBreadcrumbs] = useState([
    {text: '数据源管理'},
    {text: '数据产品', path: '/data/product'},
  ])
  const editorElem = useRef(null)
  const [html, setHtml] = useState(doc)
  const router = useRouter()

  useEffect(() => {
    setBreadcrumbs([...breadcrumbs, {text: router.query.name}])

    const E = require('wangeditor')
    const editor = new E(editorElem.current)

    editor.customConfig.pasteFilterStyle = false
    editor.customConfig.onchange = (html) => {
      // console.log(html)
      setHtml(html)
    }
    editor.create()
    editor.txt.html(doc)

    editor.$textContainerElem.css('height', '600px !important')
  }, [])

  const onSubmit = async () => {
    const params = {
      bizId: router.query.id,
      content: html,
    }
    try {
      const {
        data: {code},
      } = await fetch(
        'fincloud.admin.center.facade.api.devdocservice.savedsmdocbybizid',
        [params],
      )
      if (code === 0) {
        message.success('保存成功')
        // router.back()
      }
    } catch (err) {}
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space size={30} direction="vertical" style={{width: '100%'}}>
        <div ref={editorElem} style={{background: '#fff'}}></div>
        <Button type="primary" onClick={onSubmit}>
          提交
        </Button>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {id},
  },
}) => {
  try {
    const {
      data: {code, data},
    } = await fetch(
      'fincloud.admin.center.facade.api.devdocservice.getdsmdocbybizid',
      [{bizId: id}],
    )
    if (code === 0) {
      return {doc: data.content}
    }
    return {doc: ''}
  } catch (err) {
    return {doc: ''}
  }
}

export default body
