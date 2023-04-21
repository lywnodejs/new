import styles from '../style.less'
import {Card} from 'antd'

function CateTitleCard({title}) {
  return (
    <Card
      style={{
        width: '100%',
        marginTop: '10px',
      }}
      bodyStyle={{padding: '10px 24px'}}
    >
      <div>
        <span style={{fontSize: '16px', fontWeight: 'bold'}}>{title}</span>
      </div>
    </Card>
  )
}

export default CateTitleCard
