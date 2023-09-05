import { FC } from 'react'

import { Modal } from 'components'
import { IAccountDTO } from 'types'
import useAccountForm from 'pages/Accounts/_hooks/useAccountForm'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  data?: IAccountDTO
}

const UpdateAccountModal: FC<Props> = ({ visible, setVisible, data }) => {
  const form = useAccountForm({ data, visible, setVisible })

  return (
    <Modal title="Update Account" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default UpdateAccountModal
