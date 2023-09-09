import { FC } from 'react'

import { Modal } from 'components'
import { useIdentityForm } from '../../_hooks'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setIdentityModal } from 'store/slices/modals'

const AddIdentityModal: FC = () => {
  const {
    modals: { identityModal },
  } = useAppSelector((store) => store)
  const dispatch = useAppDispatch()
  const setVisible = (bool: boolean) => {
    dispatch(setIdentityModal(bool))
  }
  const form = useIdentityForm({ visible: identityModal, setVisible, type: 'POST' })

  return (
    <Modal title="Add Identity" open={identityModal} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default AddIdentityModal
