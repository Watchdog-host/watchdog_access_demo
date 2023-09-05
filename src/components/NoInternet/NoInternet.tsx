import { FC, ReactNode } from 'react'

import classes from './NoInternet.module.scss'
import { Row } from 'antd'
import Col from 'antd/lib/grid/col'
import { WifiOff } from 'tabler-icons-react'

type Props = {
  children?: ReactNode
}

const NoInternet: FC<Props> = () => {
  return (
    <Row className={classes.wrapper} justify={'center'} align={'middle'}>
      <Col>
        <WifiOff size={120} />
      </Col>
      <Col className={classes.textBox}>
        <b>Oops, No internet Connection</b>
        <p>Make sure wifi or celluler data is turned on.</p>
      </Col>
    </Row>
  )
}

export default NoInternet
