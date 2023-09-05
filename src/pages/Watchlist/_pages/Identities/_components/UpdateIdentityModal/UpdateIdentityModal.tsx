import { FC } from 'react'

import { Modal } from 'components'
import { IIdentityDTO } from 'types'
import { useIdentityForm } from '../../_hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  data?: IIdentityDTO
}

const UpdateIdentityModal: FC<Props> = ({ visible, setVisible, data }) => {
  const form = useIdentityForm({ data, visible, setVisible, type: 'PUT' })

  return (
    <Modal title="Update Identity" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default UpdateIdentityModal
