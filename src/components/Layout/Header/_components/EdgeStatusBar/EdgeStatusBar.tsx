import React, { memo, useEffect, useState } from 'react'
import classes from './EdgeStatusBar.module.scss'
import { InfoCircle } from 'tabler-icons-react'
import { svgVariables } from 'constants/common'
import { Tooltip } from 'antd'
import { useAppSelector } from 'store/hooks'
import { IEdgeStatus } from 'types'
import { useEdgeStatus } from 'hooks'

const EdgeStatusBar = () => {
  const info = useEdgeStatus()

  const getGradientColor = (percentage: number) => {
    const green = [70, 190, 163]
    const yellow = [255, 204, 0]
    const red = [255, 79, 55]

    const calculateColor = (colorStart: number[], colorEnd: number[], percent: number) => {
      const color = colorStart.map((start, index) => {
        const end = colorEnd[index]
        const delta = end - start
        return Math.round(start + delta * percent)
      })
      return `rgb(${color.join(', ')})`
    }
    let color
    if (percentage <= 50) {
      color = calculateColor(green, yellow, percentage / 50)
    } else {
      color = calculateColor(yellow, red, (percentage - 50) / 50)
    }
    return `linear-gradient(90deg, ${color} 0%, ${color} ${percentage}%, ${color} 100%)`
  }
  if (!info) return null
  return (
    <>
      <div className={classes.box2}>
        <div className={classes.line}>
          <div className={classes.header}>
            <Tooltip
              placement="bottomLeft"
              title={
                <ul className={classes.tooltipContent}>
                  <li>
                    <span>CPU:</span> <span>{info?.system_info?.cpu?.toFixed(2)}%</span>{' '}
                  </li>
                  <li>
                    <span>Temperature:</span> <span>{info?.system_info?.cpu_temperature}%</span>
                  </li>
                </ul>
              }
            >
              <span className={classes.label}>
                <span>CPU</span> <InfoCircle color={svgVariables.$darkGray} size={10} />
              </span>
            </Tooltip>
            <span className={classes.percentage}>{info?.system_info?.cpu?.toFixed(2)}%</span>
          </div>
          <div className={classes.indicator}>
            <span style={{ background: getGradientColor(info?.system_info?.cpu || 0), width: `${info?.system_info?.cpu?.toFixed(2)}%` }}></span>
          </div>
        </div>
        <div className={classes.line}>
          <div className={classes.header}>
            <Tooltip
              title={
                <ul className={classes.tooltipContent}>
                  <li>
                    <span>RAM:</span> <span>{info?.system_info?.memory?.toFixed(2)}%</span>
                  </li>
                  <li>
                    <span>SWAP:</span> <span>{info?.system_info?.swap?.toFixed(2)}%</span>
                  </li>
                  <li>
                    <span>DISK:</span> <span>{info?.system_info?.disk?.toFixed(2)}%</span>
                  </li>
                </ul>
              }
            >
              <span className={classes.label}>
                <span>RAM</span> <InfoCircle color={svgVariables.$darkGray} size={10} />
              </span>
            </Tooltip>
            <span className={classes.percentage}>{info?.system_info?.memory?.toFixed(2)}%</span>
          </div>
          <div className={classes.indicator}>
            <span
              style={{
                background: getGradientColor(info?.system_info?.memory || 0),
                width: `${info?.system_info?.memory?.toFixed(2)}%`,
              }}
            ></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(EdgeStatusBar)
