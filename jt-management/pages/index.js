import {Context} from '~/pages/_app'
import {useRouter} from 'next/router'
import {useEffect, useState, useContext} from 'react'
import {Layout} from '~/components/Layout'

const getPath = (menu) => {
  if (Array.isArray(menu) && menu.length > 0) {
    // console.log(menu[0].path, 'menu')
    if (!!menu[0].path) {
      return menu[0].path
    }
    return getPath(menu[0].children)
  }
}

function body() {
  const {menu} = useContext(Context)
  const router = useRouter()

  useEffect(() => {
    // console.log('menu', menu)
    // console.log(getPath(m), '-----------')
    const path = getPath(menu)
    if (path) {
      router.push(path)
    }
  }, [])

  return <Layout />
}

export default body
