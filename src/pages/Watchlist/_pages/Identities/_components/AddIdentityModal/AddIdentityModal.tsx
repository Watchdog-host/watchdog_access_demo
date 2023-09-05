import { FC } from 'react'

import { Modal } from 'components'
import { useIdentityForm } from '../../_hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const AddIdentityModal: FC<Props> = ({ visible, setVisible }) => {
  const form = useIdentityForm({ visible, setVisible, type: 'POST' })

  return (
    <Modal title="Add Identity" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default AddIdentityModal
