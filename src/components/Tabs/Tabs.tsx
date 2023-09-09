import { FC, ReactNode, useState, MouseEvent, memo } from 'react'

import classes from './Tabs.module.scss'
import { TabsProps } from 'antd'
import cn from 'classnames'

type Props = {
  items: TabsProps['items']
  onTabClick?: (tab: string, e: MouseEvent<HTMLDivElement>) => void
}

const Tabs: FC<Props> = ({ items, onTabClick }) => {
  const [tab, setTab] = useState('1')

  function handleTabClick(tab: string, e: MouseEvent<HTMLDivElement>) {
    setTab(tab)
    if (onTabClick) {
      onTabClick(tab, e)
    }
  }
  return (
    <div>
      <header className={classes.tabBox}>
        {items?.map(({ label, key }) => (
          <div className={cn(classes.tab, { [classes.active]: key === tab })} onClick={(e) => handleTabClick(key, e)} key={key}>
            {label}
          </div>
        ))}
      </header>
      <div>
        {items?.map(({ children, key }) => (
          <section className={cn(classes.content, { [classes.active]: key === tab })} key={key}>
            {children}
          </section>
        ))}
      </div>
    </div>
  )
}

export default memo(Tabs)
