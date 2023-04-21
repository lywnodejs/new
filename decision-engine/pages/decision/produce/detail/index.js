import React, {useEffect, useState} from 'react'
import {withRouter} from 'next/router'
import CommonPage from '../../common/detail/index'

function body({router}) {
  return <CommonPage partialPro={1} />
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
