import { FC } from 'react'

import { Modal } from 'components'
import { IWatchlistDTO } from 'types'
import { useWatchlistForm } from 'pages/Watchlist/_hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
  data?: IWatchlistDTO
}

const UpdateAccountModal: FC<Props> = ({ visible, setVisible, data }) => {
  const form = useWatchlistForm({ data, visible, setVisible })

  return (
    <Modal title="Update Watchlist" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default UpdateAccountModal
