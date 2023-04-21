import {Layout} from '~/components/Layout'
import {useEffect, useState, useContext} from 'react'
import fetch from '~/utils/fetch'
import style from './style.less'
import {Context} from '~/pages/_app'

const workLoop = (items, path, menus) => {
  for (let item of menus) {
    const children = item.children || []
    if (item.path === path) {
      return [...items, item]
    }
    if (children.length > 0) {
      let n = workLoop([...items, item], path, children)
      if (n) {
        return n
      }
    }
  }
}

function body({content, path}) {
  const {menu} = useContext(Context)

  let items = workLoop([], path, menu)
  let breadcrumbs = items.map((item) => ({text: item.pageName}))

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div
        className={[style.content, style.rich].join(' ')}
        dangerouslySetInnerHTML={{
          __html: content ? content.replace('target="_blank"', '') : '',
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {id: bizId},
    asPath,
  },
}) => {
  // console.log(asPath)
  try {
    const {
      data: {code, data: {content}} = {code: -1, data: {}},
      data,
    } = await fetch(
      'fincloud.admin.center.facade.api.devdocservice.getdsmdocbybizid',
      [{bizId}],
    )

    if (code === 0) {
      return {content, path: asPath}
    }

    return {content: '', path: asPath}
  } catch (e) {
    return {content: '', path: asPath}
  }
}

export default body
