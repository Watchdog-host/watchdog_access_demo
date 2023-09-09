import { FC } from 'react'
import { Col, Row } from 'antd'

import { Modal } from 'components'
import { VERSIONS } from 'constants/common'
import dayjs from 'dayjs'
import { useEdgeStatusQuery } from 'store/endpoints'
import classes from './HelpModal.module.scss'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setHelpModal } from 'store/slices/modals'

const HelpModal: FC = () => {
  const { data } = useEdgeStatusQuery()
  const { helpModal } = useAppSelector((state) => state.modals)
  const dispatch = useAppDispatch()

  return (
    <Modal title="Help" open={helpModal} onOk={() => dispatch(setHelpModal(false))} onCancel={() => dispatch(setHelpModal(false))} style={{ marginTop: '10%' }}>
      <h3 className={classes.title}>Access™ WEB</h3>
      <div className={classes.frame}>
        <Row className={classes.info}>
          <Row>
            <b>Version:</b>&nbsp;
            <span>{VERSIONS.ACCESS_WEB}</span>
          </Row>
        </Row>
      </div>
      <h3 className={classes.title}>Access™ API</h3>
      <div className={classes.frame}>
        <Row className={classes.info}>
          <Row>
            <b>Version:</b>&nbsp;
            <span>{data?.version}</span>
          </Row>
          <Row>
            <b>URL:</b>&nbsp;
            <a href="https://access.watchdog.host/api">https://access.watchdog.host/api</a>
          </Row>
        </Row>
      </div>

      <Row justify="center" style={{ marginTop: 30 }}>
        <Col>
          <h4>© {dayjs().year()} Watchdog™</h4>
        </Col>
      </Row>
    </Modal>
  )
}

export default HelpModal
