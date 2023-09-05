import { FC } from 'react'

import { Modal } from 'components'
import { useWatchlistForm } from 'pages/Watchlist/_hooks'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const AddWatchlistModal: FC<Props> = ({ visible, setVisible }) => {
  const form = useWatchlistForm({ visible, setVisible })

  return (
    <Modal title="Add Watchlist" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      {form}
    </Modal>
  )
}

export default AddWatchlistModal
