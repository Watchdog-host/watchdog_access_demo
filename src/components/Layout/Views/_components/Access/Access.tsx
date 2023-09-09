import { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import classes from './Access.module.scss'
import { Col, Form, Grid, Row } from 'antd'
import { Button, DeviceCard, Loader, NoData } from 'components'
import { useLazyDevicesQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'
import { AccountTypeEnum } from 'constants/enums'
import { IProfileDTO } from 'types'
import AccessCard from './_components/AccessCard'
import cn from 'classnames'
import { isCurrentPath } from 'utils'
import useGetAccessWs from './_hooks/useGetAccessWs'
import { useLocalStorage } from 'react-use'
import { Settings } from 'tabler-icons-react'
import SettingsModal from './_components/SettingsModal'

type Props = {
  children?: ReactNode
}

const Access: FC<Props> = () => {
  const [form] = Form.useForm()
  const [settingsModal, setSettingsModal] = useState<boolean>(false)
  const isAccess = isCurrentPath(['Access'])
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)

  const [storageData, setStorageData] = useLocalStorage('access')

  const stagedSelectValue = useMemo(() => {
    if (currentEdge && storageData && (storageData as any)[currentEdge.id]) {
      return (storageData as any)[currentEdge.id] as number[]
    }
    return []
  }, [storageData, currentEdge])

  const { data: accessDataWs } = useGetAccessWs({
    device_ids: stagedSelectValue,
    verified_only: false,
    skip_image: false,
  })

  const [getLazyDevices, { data: lazyDevicesData, isSuccess }] = useLazyDevicesQuery()

  useEffect(() => {
    if (currentEdge) {
      const edgeId = currentEdge.id
      const storedData = storageData && (storageData as any)[edgeId]
      getLazyDevices({
        filter: { edge_id: edgeId || 0, id: storedData?.length ? [...storedData] : [0] },
      })
    }
  }, [storageData, currentEdge])

  return (
    <div className={`fade`}>
      <Row className={'navigation'} align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Access</h2>
            </Col>
            <Col>
              <span className={'navigationFoundText'}>{lazyDevicesData?.length ? `Found ${lazyDevicesData?.length} Devices` : 'No found Devices'}</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button className={classes.settingBtn} icon={<Settings />} type="link" onClick={() => setSettingsModal(true)}>
            {!xs && 'Settings'}
          </Button>
        </Col>
      </Row>
      <div className={cn(classes.dataWrapper, { [classes.isAccess]: isAccess })}>
        {isAccess && (
          <section className={classes.devices}>
            {!isSuccess ? (
              <Loader />
            ) : lazyDevicesData?.length ? (
              <div className={classes.deviceRow}>
                {lazyDevicesData?.map((device) => (
                  <DeviceCard
                    key={device.id}
                    role_policy={AccountTypeEnum.Viewer >= (localProfile ? localProfile?.type : AccountTypeEnum.Owner)}
                    data={device}
                    title={device?.title}
                  />
                ))}
              </div>
            ) : (
              <NoData />
            )}
          </section>
        )}
        <section className={cn(classes.alerts, { [classes.isNotAccess]: !isAccess })}>
          {accessDataWs?.length ? (
            <Row gutter={[12, 12]}>
              {accessDataWs?.map((access) => (
                <Col span={24} key={access?.id} className="fade">
                  <AccessCard data={access} />
                </Col>
              ))}
            </Row>
          ) : (
            <NoData />
          )}
        </section>
      </div>
      {settingsModal && <SettingsModal setStorageData={setStorageData} storageData={storageData} visible={settingsModal} setVisible={setSettingsModal} />}
    </div>
  )
}

export default Access
