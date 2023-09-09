import React, { FC } from 'react'
import _ from 'lodash'

import { Modal } from 'components'
import { useLocation } from 'react-router-dom'
import { useBarcodeScannerForm } from 'pages/BarcodeScanner/_hooks'
import { useAppSelector } from 'store/hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const UpdateBarcodeScannerModal: FC<Props> = ({ visible, setVisible }) => {
  const { selecteData } = useAppSelector((store) => store.datas)
  const form = useBarcodeScannerForm({ data: selecteData, visible, setVisible })
  const { pathname } = useLocation()
  return (
    <Modal title={`Update ${_.upperFirst(pathname.slice(1))}`} open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default UpdateBarcodeScannerModal
