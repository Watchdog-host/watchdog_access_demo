import React, { FC, memo } from 'react'
import { Modal as AntdModal, ModalProps } from 'antd'

import './Modal.scss'

type Props = ModalProps & {
  width?: number
}

const Modal: FC<Props> = ({ width = 600, getContainer = false, children, ...props }) => {
  return (
    <AntdModal width={width} getContainer={getContainer} footer={null} forceRender {...props}>
      {children}
    </AntdModal>
  )
}

export default memo(Modal)
