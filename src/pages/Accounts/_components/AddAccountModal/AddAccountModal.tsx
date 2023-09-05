import { FC } from 'react'

import { Modal } from 'components'
import useAccountForm from 'pages/Accounts/_hooks/useAccountForm'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const AddAccountModal: FC<Props> = ({ visible, setVisible }) => {
  const form = useAccountForm({ visible, setVisible })

  return (
    <Modal title="Add Account" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default AddAccountModal
