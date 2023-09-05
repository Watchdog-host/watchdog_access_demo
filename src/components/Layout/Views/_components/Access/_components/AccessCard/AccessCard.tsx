import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Col, Divider, Image, Menu, Popconfirm, Popover, Row, Typography } from 'antd'
import { AlertTriangle, Door, Dots } from 'tabler-icons-react'

import { svgVariables } from 'constants/common'

import classes from './AccessCard.module.scss'
import { AccessTypeIcons, AlertTypeIcons, VerifyTypeIcons } from 'constants/icons'
import Button from 'components/Button'
import { IAccessDTO } from 'types'
import AddIdentityModal from '../AddIdentityModal'
import dayjs from 'dayjs'
import { AccessTypeEnum, AlertTypeEnum, GrantTypeEnum } from 'constants/enums'

type Props = {
  children?: ReactNode
  data: IAccessDTO
}

const AccessCard: FC<Props> = ({ data }) => {
  const [identityModal, setIdentityModal] = useState<boolean>(false)
  const [accessType, setAccessType] = useState({ label: '', color: '' })

  useEffect(() => {
    if (data.type !== AccessTypeEnum.Checkout) {
      if (data.grant_type == GrantTypeEnum.Undefined) {
        setAccessType({ label: 'Undefined', color: svgVariables.$yellow })
      } else if (data.grant_type == GrantTypeEnum.Allow) {
        setAccessType({ label: 'Allow', color: svgVariables.$green })
      } else if (data.grant_type == GrantTypeEnum.Deny) {
        setAccessType({ label: 'Deny', color: svgVariables.$red })
      } else {
        if (data.grant_type == GrantTypeEnum.Undefined) {
          if (data.identity_id == null) {
            setAccessType({ label: 'Not found', color: svgVariables.$yellow })
          } else {
            setAccessType({
              label: `${dayjs(data.time).format('HH:mm')} | ${data.paid_amount}UZS`,
              color: svgVariables.$green,
            })
          }
        } else if (data.grant_type == GrantTypeEnum.Allow) {
          if (data.identity_id == null) {
            setAccessType({ label: 'Allow', color: svgVariables.$green })
          } else {
            setAccessType({ label: `Allow | ${dayjs(data.time).format('HH:mm')}`, color: svgVariables.$green })
          }
        } else if (data.grant_type == GrantTypeEnum.Deny) {
          if (data.identity_id == null) {
            setAccessType({ label: 'Deny', color: svgVariables.$red })
          } else {
            setAccessType({ label: `Deny | ${dayjs(data.time).format('HH:mm')}`, color: svgVariables.$red })
          }
        }
      }
    }
  }, [data])

  return (
    <>
      <Row>
        <Col className={classes.statusBox} span={2}>
          <Row align="middle" style={{ height: '100%' }}>
            {AlertTypeIcons[data.alert_type]}
            {AlertTypeEnum.None !== data.alert_type && <Divider className={classes.devider} />}
            {AccessTypeIcons[data.type]}
          </Row>
        </Col>
        <Col className={classes.content} span={22}>
          <Row align="middle" gutter={16} wrap={false}>
            <Col>
              <Image
                src={`data:image/jpg;base64, ${data.image}`}
                alt={data.device_title}
                title="Click for preview"
                className={classes.img}
              />
            </Col>
            <Col span={17}>
              <Row justify="space-between" className={classes.infoHeader}>
                <p>{data.watchlist_title}</p>
                <p>
                  {dayjs(data.time).format('HH:mm')} | {dayjs(data.time).format('DD.MM')}
                </p>
              </Row>
              <Row align="middle" gutter={25}>
                <Col span={16}>
                  <Typography.Text className={classes.descriptor} ellipsis={true}>
                    {' '}
                    {data.descriptor}
                  </Typography.Text>
                </Col>
                <Col span={2}>
                  <div className={classes.confidenceBox}>
                    <span>{VerifyTypeIcons[Number(data.verified) as 1 | 0]}</span>
                    <p>{data.confidence}%</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <p className={classes.acces_type} style={{ color: accessType.color }}>
                  {accessType.label}
                </p>
              </Row>
            </Col>
          </Row>
          {/* <Popover
            className={classes.settings}
            trigger="click"
            placement="rightTop"
            zIndex={identityModal ? -1 : 1}
            content={
              <Menu
                style={{
                  width: 150,
                }}
                items={[
                  {
                    label: 'Add Identity',
                    key: 1,
                    onClick: () => {
                      setIdentityModal(true)
                    },
                  },
                ]}
              />
            }
          >
            <Button className={classes.moreBox} icon={<Dots />} onlyIcon />
          </Popover> */}
        </Col>
      </Row>
      {identityModal && <AddIdentityModal data={data} visible={identityModal} setVisible={setIdentityModal} />}
    </>
  )
}

export default AccessCard
