import React, { FC, ReactNode } from 'react'
import { Dropdown as AntdDropdown, Row } from 'antd'
import { ChevronDown } from 'tabler-icons-react'
import cn from 'classnames'

import classes from './Dropdown.module.scss'

export type DropdownMenuTypes = {
  key: string | number
  label: string
  icon?: any
  onClick?: (e: any) => void
}

type Props = {
  children?: ReactNode
  dropdownItems?: any
  className?: string
  edge_id?: number
  setSelectParentId?: (e: any) => void
  disabled?: boolean
  withoutIcon?: boolean
}

const Dropdown: FC<Props> = ({ children, dropdownItems, className, edge_id, setSelectParentId, disabled }) => {
  const classNames = cn(className && className, classes.dropdown, disabled && classes.disabled)
  return (
    <AntdDropdown menu={{ items: dropdownItems }} className={classNames} disabled={disabled}>
      <Row wrap={false}>
        <span onClick={(e) => setSelectParentId && setSelectParentId(edge_id)}>{children}</span>
        {!disabled && (
          <span className={classes.icon}>
            <ChevronDown size={18} />
          </span>
        )}
      </Row>
    </AntdDropdown>
  )
}

export default Dropdown
