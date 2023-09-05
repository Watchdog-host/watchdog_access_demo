import { FC } from 'react'

import { Modal } from 'components'
import { useIdentityForm } from 'components/Layout/Views/_components/Access/_hooks'
import { IAccessDTO } from 'types'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  data: IAccessDTO
}

const AddIdentityModal: FC<Props> = ({ data, visible, setVisible }) => {
  const form = useIdentityForm({ data, visible, setVisible, type: 'POST' })

  return (
    <Modal title="Add Identity" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default AddIdentityModal
