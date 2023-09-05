import { FC, useRef, useState } from 'react'
import { Modal, ModalProps } from 'antd'
import Draggable from 'react-draggable'
import type { DraggableData, DraggableEvent } from 'react-draggable'

import classes from './ModalDraggable.module.scss'

type Props = ModalProps & {
  width?: number
}

const ModalDraggable: FC<Props> = ({ ...props }) => {
  const [disabled, setDisabled] = useState(false)
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  })
  const draggleRef = useRef<HTMLDivElement>(null)

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  }

  return (
    <>
      <Modal
        {...props}
        title={
          <div
            className={classes.title}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false)
              }
            }}
            onMouseOut={() => {
              setDisabled(true)
            }}
          >
            {props.title}
          </div>
        }
        modalRender={(modal) => (
          <Draggable
            bounds={bounds}
            disabled={disabled}
            defaultPosition={{ x: -370, y: 370 }}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        footer={null}
        className={classes.customModal}
      >
        <p>Just don&apos;t learn physics at school and your life will be full of magic and miracles.</p>
        <br />
        <p>Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.</p>
      </Modal>
    </>
  )
}

export default ModalDraggable
