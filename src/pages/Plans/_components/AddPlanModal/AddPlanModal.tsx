import React, { FC, memo } from 'react'
import _ from 'lodash'

import { Modal } from 'components'
import { useLocation } from 'react-router-dom'
import { usePlanForm } from 'pages/Plans/_hooks'

type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const AddCameraModal: FC<Props> = ({ visible, setVisible }) => {
  const form = usePlanForm({ setVisible })
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

export default memo(AddCameraModal)
