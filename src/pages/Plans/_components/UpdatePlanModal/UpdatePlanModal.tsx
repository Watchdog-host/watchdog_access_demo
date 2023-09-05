import React, { FC } from 'react'
import _ from 'lodash'

import { Modal } from 'components'
import { IPlanDTO } from 'types'
import { useLocation } from 'react-router-dom'
import { usePlanForm } from 'pages/Plans/_hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  data?: IPlanDTO
}

const UpdateCameraModal: FC<Props> = ({ visible, setVisible, data }) => {
  const form = usePlanForm({ data, visible, setVisible })
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
