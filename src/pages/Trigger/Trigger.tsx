import { FC, ReactNode, memo, useState } from 'react'

import { Col, Empty, Grid, Row } from 'antd'
import { useDeleteDeviceMutation, useDevicesQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'
import { useLocation } from 'react-router-dom'
import { useGetRole } from 'hooks'
import { DEVICE_SELECTS } from 'constants/common'
import { DEVICE_TYPE, IDeviceDTO } from 'types'
import _ from 'lodash'

import classes from './Trigger.module.scss'
import { AddDescriptorModal, Button, DeviceCard, Loader, NoData } from 'components'
import { toast } from 'react-hot-toast'
import { Plus } from 'tabler-icons-react'
import AddTriggerModal from './_components/AddTriggerModal'
import UpdateTriggerModal from './_components/UpdateTriggerModal'

type Props = {
  children?: ReactNode
}

const Trigger: FC<Props> = () => {
  const [selectedDevice, setSelectedDevice] = useState<IDeviceDTO>()
  const [addTriggerModal, setAddTriggerModal] = useState<boolean>(false)
  const [updateTriggerModal, setUpdateTriggerModal] = useState<boolean>(false)
  const [addDescriptor, setAddDescriptor] = useState<boolean>(false)
  const { useBreakpoint } = Grid
  const { xxl, md } = useBreakpoint()
  const {
    navigation: { currentEdge },
  } = useAppSelector((state) => state)
  const { isOwner, isAdmin } = useGetRole()
  const { pathname } = useLocation()

  const { data: devicesData, isSuccess } = useDevicesQuery({
    filter: {
      edge_id: currentEdge?.id,
      type: _.find(DEVICE_SELECTS, {
        label: _.upperFirst(pathname.slice(1)) as DEVICE_TYPE,
      })?.value.toString(),
    },
    sort: 'title',
  })
  const [deleteMutation] = useDeleteDeviceMutation()

  const onDelete = () => {
    if (isOwner || isAdmin) {
      const mutationPromise = deleteMutation({
        id: selectedDevice?.id,
      }).unwrap()
      toast.promise(mutationPromise, {
        loading: `deleting ${pathname.slice(1)}...`,
        success: `successfully delete`,
        error: ({ data }) => data?.error,
      })
    } else {
      toast.error('Permission denied!')
    }
  }
  return (
    <div className={`fade container`}>
      <Row className={'navigation'} align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Triggers</h2>
            </Col>

            <Col>
              <span className={'navigationFoundText'}>
                {devicesData?.length ? `Found ${devicesData?.length} Triggers` : 'No found Triggers'}
              </span>
            </Col>
          </Row>
        </Col>
        {isOwner || isAdmin ? (
          <Col>
            <Row justify="space-between" align="middle" wrap={false}>
              <Col>
                <Button
                  icon={<Plus />}
                  type="link"
                  className={'navigationAddButton'}
                  onClick={() => setAddTriggerModal(true)}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>
      <div className="dataWrapper">
        {!isSuccess ? (
          <Loader />
        ) : devicesData?.length ? (
          <Row gutter={[16, 16]} style={{ paddingBottom: 16 }}>
            {devicesData?.map((device) => (
              <Col span={xxl ? 8 : md ? 12 : 24} key={device.id} className={classes.StreamsCol}>
                <DeviceCard
                  data={device}
                  title={device?.title}
                  visible={updateTriggerModal}
                  setSelected={setSelectedDevice}
                  setVisibleModal={setUpdateTriggerModal}
                  setDescriptorModal={setAddDescriptor}
                  onDelete={onDelete}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <NoData />
        )}
        {addTriggerModal && <AddTriggerModal visible={addTriggerModal} setVisible={setAddTriggerModal} />}
        {updateTriggerModal && (
          <UpdateTriggerModal visible={updateTriggerModal} setVisible={setUpdateTriggerModal} data={selectedDevice} />
        )}
        {addDescriptor && (
          <AddDescriptorModal visible={addDescriptor} setVisible={setAddDescriptor} id={selectedDevice?.id} />
        )}
      </div>
    </div>
  )
}

export default memo(Trigger)
