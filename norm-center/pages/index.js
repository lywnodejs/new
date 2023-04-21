import {Context} from '~/pages/_app'
import {useRouter} from 'next/router'
import {useEffect, useState, useContext} from 'react'
import {Layout} from '~/components/Layout'

function body() {
  const {menu} = useContext(Context)
  const router = useRouter()

  useEffect(() => {
    if (Array.isArray(menu) && menu.length > 0) {
      if (menu[0].path) {
        router.push(menu[0].path)
      } else if (
        Array.isArray(menu[0].children) &&
        menu[0].children.length > 0 &&
        menu[0].children[0].path
      ) {
        router.push(menu[0].children[0].path)
      }
    }
  }, [])

  return <Layout />
}

export default body
