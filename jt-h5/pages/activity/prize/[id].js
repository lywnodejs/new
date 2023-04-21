import axios from 'axios'
import style from './style.less'
import Head from 'next/head'

const images = [
  '/image/icon-ticket.png',
  '/image/icon-article.png',
  '/image/icon-article.png',
  '/image/icon-cash.png',
]

const Cell = ({item: {type, name, msg}}) => {
  return (
    <div className={style.cell}>
      <img src={images[type]} />
      <div>
        <h1>{name}</h1>
        <p>{msg}</p>
      </div>
    </div>
  )
}

function body({items}) {
  return (
    <div className={style.warp}>
      <Head>
        <title>我的奖品</title>
      </Head>
      {items.map((v, i) => (
        <Cell key={i} item={v} />
      ))}
    </div>
  )
}
body.getInitialProps = async ({
  ctx: {
    query: {id, sessionId},
  },
}) => {
  try {
    const {
      data: {code, data},
    } = await axios.post(`/a-api/activity/my-prize.do?sessionId=${sessionId}`, {
      id,
    })
    console.log(data)
    if (code === 0) {
      return data
    }
    return {items: []}
  } catch (err) {
    console.log(err)
    return {items: []}
  }
}

export default body
