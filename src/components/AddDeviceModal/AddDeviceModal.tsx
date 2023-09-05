import React, { FC, memo } from 'react'
import _ from 'lodash'

import { Modal } from 'components'
import { useDeviceForm } from 'hooks'
import { useLocation } from 'react-router-dom'

type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const AddDeviceModal: FC<Props> = ({ visible, setVisible }) => {
  const form = useDeviceForm({ setVisible })
  const { pathname } = useLocation()

  return (
    <Modal
      title={`Add ${_.upperFirst(pathname.slice(1))}`}
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      {form}
    </Modal>
  )
}

export default memo(AddDeviceModal)
