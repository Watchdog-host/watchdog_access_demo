import { FC, ReactNode, memo, useState } from 'react'

import classes from './Camera.module.scss'
import { Col, Empty, Grid, Row } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from 'store/hooks'
import { useGetRole } from 'hooks'
import { useDeleteDeviceMutation, useDevicesQuery } from 'store/endpoints'
import { DEVICE_SELECTS } from 'constants/common'
import { DEVICE_TYPE, IDeviceDTO } from 'types'
import { toast } from 'react-hot-toast'
import { Plus } from 'tabler-icons-react'
import _ from 'lodash'
import { AddDescriptorModal, Button, DeviceCard, Loader, NoData } from 'components'
import AddCameraModal from './_components/AddCameraModal'
import UpdateCameraModal from './_components/UpdateCameraModal'
type Props = {
  children?: ReactNode
}

const Camera: FC<Props> = () => {
  const [selectedDevice, setSelectedDevice] = useState<IDeviceDTO>()
  const [addCameraModal, setAddCameraModal] = useState<boolean>(false)
  const [updateCameraModal, setUpdateCameraModal] = useState<boolean>(false)
  const [addDescriptor, setAddDescriptor] = useState<boolean>(false)
  const { useBreakpoint } = Grid
  const { xxl, md } = useBreakpoint()
  const {
    navigation: { currentEdge },
  } = useAppSelector((state) => state)
  const { isOwner, isAdmin , isAgent,isCustomer} = useGetRole()
  const { pathname } = useLocation()

  const [deleteMutation] = useDeleteDeviceMutation()

  const { data: devicesData, isSuccess } = useDevicesQuery({
    filter: {
      edge_id: currentEdge?.id || 0,
      type: _.find(DEVICE_SELECTS, {
        label: _.upperFirst(pathname.slice(1)) as DEVICE_TYPE,
      })?.value.toString(),
    },
    sort: 'title',
  })

  const onDelete = () => {
      const mutationPromise = deleteMutation({
        id: selectedDevice?.id,
      }).unwrap()
      toast.promise(mutationPromise, {
        loading: `deleting ${pathname.slice(1)}...`,
        success: `successfully delete`,
        error: ({ data }) => data?.error,
      })
  }
  return (
    <div className={`fade camera container`}>
      <Row className={'navigation'} align="top" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Cameras</h2>
            </Col>
            <Col>
              <span className={'navigationFoundText'}>
                {devicesData?.length ? `Found ${devicesData?.length} Cameras` : 'No found Cameras'}
              </span>
            </Col>
          </Row>
        </Col>
        {isOwner || isAdmin || isAgent ||  isCustomer? (
          <Col>
            <Row justify="space-between" align="middle" wrap={false}>
              <Col>
                <Button
                  icon={<Plus />}
                  type="link"
                  className={'navigationAddButton'}
                  onClick={() => setAddCameraModal(true)}
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
              <Col span={xxl ? 8 : md ? 12 : 24} key={device.id} className={'fade'}>
                <DeviceCard
                  data={device}
                  title={device?.title}
                  visible={updateCameraModal}
                  setSelected={setSelectedDevice}
                  setVisibleModal={setUpdateCameraModal}
                  setDescriptorModal={setAddDescriptor}
                  onDelete={onDelete}
                  role_policy={isOwner || isAdmin || isAgent ||  isCustomer}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <NoData />
        )}
        {addCameraModal && <AddCameraModal visible={addCameraModal} setVisible={setAddCameraModal} />}
        {updateCameraModal && (
          <UpdateCameraModal visible={updateCameraModal} setVisible={setUpdateCameraModal} data={selectedDevice} />
        )}
        {addDescriptor && (
          <AddDescriptorModal visible={addDescriptor} setVisible={setAddDescriptor} id={selectedDevice?.id} />
        )}
      </div>
    </div>
  )
}
export default memo(Camera)
