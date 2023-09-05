import React, { FC } from 'react'
import _ from 'lodash'

import { Modal } from 'components'
import { IDeviceDTO } from 'types'
import { useLocation } from 'react-router-dom'
import { useCameraForm } from 'pages/Camera/_hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  data?: IDeviceDTO
}

const UpdateCameraModal: FC<Props> = ({ visible, setVisible, data }) => {
  const form = useCameraForm({ data, visible, setVisible })
  const { pathname } = useLocation()
  return (
    <Modal
      title={`Update ${_.upperFirst(pathname.slice(1))}`}
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      {form}
    </Modal>
  )
}

export default UpdateCameraModal
