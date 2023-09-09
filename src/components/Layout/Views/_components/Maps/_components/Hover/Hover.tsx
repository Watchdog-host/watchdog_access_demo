import React, { FC } from 'react'
import classes from './Hover.module.scss'

type Props = {
  state: { clicked: boolean; hovered: boolean; x: number; y: number }
  title: string | undefined
}

const Hover: FC<Props> = ({ state, title }) => {
  return (
    <div className={classes.hover} style={{ left: state.x - 46, top: state.y - 56 }}>
      {title}
    </div>
  )
}

export default Hover
