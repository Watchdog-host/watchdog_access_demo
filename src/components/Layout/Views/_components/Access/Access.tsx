import { FC, ReactNode, useState } from 'react'

import classes from './Access.module.scss'
import { Col, Grid, Row } from 'antd'
import { DeviceCard, FormElements, Loader, NoData } from 'components'
import { useDevicesQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'
import { groupBy, map } from 'lodash'
import { DeviceTypeEnum } from 'constants/enums'
import { IGroupOptions } from 'types'
import AccessCard from './_components/AccessCard'
import cn from 'classnames'
import { isCurrentPath } from 'utils'
import useGetAccessWs from './_hooks/useGetAccessWs'

type Props = {
  children?: ReactNode
}

const Access: FC<Props> = () => {
  const [selectValue, setSelectValue] = useState<number[]>([])

  const { useBreakpoint } = Grid
  const { lg, xxl, md, xl, xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { data: devicesByIdQuery, isSuccess } = useDevicesQuery({
    filter: { edge_id: currentEdge?.id, id: selectValue.length ? selectValue : [0] },
  })
  const allDevicesQuery = useDevicesQuery({ filter: { edge_id: currentEdge?.id || 0} })

  const devicesData = allDevicesQuery.data
  const groupedOptions = groupBy(devicesData, 'type')
  const deviceOptions = map(groupedOptions, (data, key) => {
    return {
      label: DeviceTypeEnum[key as any],
      options: data?.map((device) => ({
        title: device.title,
        value: device.id,
      })),
    }
  }) as IGroupOptions[]

  const isAccess = isCurrentPath(['Access'])

  const { data: accessDataWs } = useGetAccessWs({ device_ids: selectValue, verified_only: false, skip_image: false })

  return (
    <div className={`fade container`}>
      <Row className={cn('navigation', { [classes.isAccess]: !isAccess })} align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Access</h2>
            </Col>

            <Col>
              <span className={'navigationFoundText'}>
                {devicesByIdQuery?.length ? `Found ${devicesByIdQuery?.length} Access` : 'No found Devices'}
              </span>
            </Col>
          </Row>
        </Col>
        <Col span={!isAccess ? 6 : xs ? 8 : 4}>
          <FormElements.Select
            maxTagCount={1}
            placeholder={'Select devices'}
            mode="multiple"
            onChange={(value) => setSelectValue(value)}
            groupOptions={deviceOptions}
            size="large"
          />
        </Col>
      </Row>
      <div className={cn(classes.dataWrapper, { [classes.isAccess]: isAccess && lg })}>
        {isAccess && (
          <section className={classes.devices}>
            {!isSuccess ? (
              <Loader />
            ) : devicesByIdQuery?.length ? (
              <Row gutter={[16, 16]} style={{ paddingBottom: 16 }}>
                {devicesByIdQuery?.map((device) => (
                  <Col span={xxl ? 8 : md ? 12 : 24} key={device.id}>
                    <DeviceCard
                      data={device}
                      title={device?.title}
                      setDescriptorModal={()=>{}}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <NoData />
            )}
          </section>
        )}
        <section className={cn(classes.alerts, { [classes.isNotAccess]: !isAccess })}>
          {accessDataWs?.length ? (
            <Row gutter={[12, 12]}>
              {accessDataWs?.map((access) => (
                <Col span={24} key={access?.id} className={'fade'}>
                  <AccessCard data={access} />
                </Col>
              ))}
            </Row>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default Access
