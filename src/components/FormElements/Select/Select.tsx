import React, { FC, useEffect, useState } from 'react'
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd'
import cn from 'classnames'

import { IGroupOptions } from 'types'
import './Select.scss'
import { BoxMultiple, ChevronsDown, ChevronDown } from 'tabler-icons-react'
import { svgVariables } from 'constants/common'
import { DefaultOptionType } from 'antd/es/select'

export type SelectProps = AntSelectProps & {
  className?: string
  fullWidth?: boolean
  labels?: string
  size?: string
  navigation?: boolean
  groupOptions?: IGroupOptions[]
  mode?: 'multiple' | 'tags'
}

const Select: FC<SelectProps> = ({ children, labels, mode, className, fullWidth, options, size, navigation, placeholder = 'Select...', groupOptions, ...props }) => {
  const classNames = cn(className && className, fullWidth && 'full-width', size && size, navigation && 'navigation')

  return (
    <div className="selectBox">
      <AntSelect
        placeholder={placeholder}
        className={classNames}
        mode={mode}
        showArrow={false}
        filterOption={(input: any, option: any) => option.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
        {...props}
      >
        {groupOptions
          ? groupOptions.map(({ label, options }) => (
              <AntSelect.OptGroup key={label} label={label}>
                {options?.map(({ title, value }) => (
                  <AntSelect.Option key={value} value={value}>
                    {title}
                  </AntSelect.Option>
                ))}
              </AntSelect.OptGroup>
            ))
          : options?.map(({ label, value }) => (
              <AntSelect.Option key={value} value={value}>
                {label}
              </AntSelect.Option>
            ))}
      </AntSelect>
      <ChevronDown className="multipleSelectIcon" size={18} color={svgVariables.$darkGray} />
    </div>
  )
}

export default Select
