import { FC } from 'react'
import { Col, Row } from 'antd'

import { Modal } from 'components'
import { VERSIONS } from 'constants/common'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const HelpModal: FC<Props> = ({ visible, setVisible }) => {
  return (
    <Modal
      title="Help"
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      style={{ marginTop: '10%' }}
    >
      <Row style={{ flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ marginTop: 10 }}>Panel</h3>
        <Row>
          <b>Version:</b>&nbsp;
          <span>{VERSIONS.PANEL}</span>
        </Row>

        <h3 style={{ marginTop: 20 }}>Gateway API</h3>
        <Row>
          <b>Version:</b>&nbsp;
          <span>{VERSIONS.GATEWAY_API}</span>
        </Row>
      </Row>

      <Row justify="center" style={{ marginTop: 30 }}>
        <Col>
          <h4>2023 Watchdog®</h4>
        </Col>
      </Row>
    </Modal>
  )
}

export default HelpModal
