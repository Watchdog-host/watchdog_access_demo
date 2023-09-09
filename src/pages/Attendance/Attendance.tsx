import { FC, ReactNode, memo } from 'react'

import classes from './Attendance.module.scss'
import { Col, Row } from 'antd'

type Props = {
  children?: ReactNode
}

const Attendance: FC<Props> = () => {
  return (
    <div className={`fade`}>
      <Row className={'navigation'} align="middle" justify="space-between" wrap={false}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Attendances</h2>
            </Col>

            <Col>
              <span className={'navigationFoundText'}>{[]?.length ? `Found ${[]?.length} Attendances` : 'No found Attendances'}</span>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="dataWrapper"></div>
    </div>
  )
}

export default memo(Attendance)
