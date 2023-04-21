import React, {useEffect, useState} from 'react'
import {withRouter} from 'next/router'
import CommonPage from '../common'

function body({router}) {
  return <CommonPage />
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
