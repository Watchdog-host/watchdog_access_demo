import React, { FC, memo } from 'react'
import _ from 'lodash'

import { Modal } from 'components'
import { useLocation } from 'react-router-dom'
import { useLEDMatrixForm } from 'pages/LEDMatrix/_hooks'

type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const AddPrinterModal: FC<Props> = ({ visible, setVisible }) => {
  const form = useLEDMatrixForm({ setVisible })
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

export default memo(AddPrinterModal)
