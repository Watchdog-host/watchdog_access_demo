import { FC, ReactNode, memo, useEffect, useState } from 'react'

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
import { Button, DeviceCard, Loader, NoData } from 'components'
import AddCameraModal from './_components/AddCameraModal'
import UpdateCameraModal from './_components/UpdateCameraModal'
import { logOut } from 'utils'
type Props = {
  children?: ReactNode
}

const Camera: FC<Props> = () => {
  const [addCameraModal, setAddCameraModal] = useState<boolean>(false)
  const [updateCameraModal, setUpdateCameraModal] = useState<boolean>(false)
  const { useBreakpoint } = Grid
  const { xs, xxl, md } = useBreakpoint()
  const {
    navigation: { currentEdge },
  } = useAppSelector((state) => state)
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()
  const { pathname } = useLocation()

  const {
    data: devicesData,
    isSuccess,
    error,
  } = useDevicesQuery({
    filter: {
      edge_id: currentEdge?.id || 0,
      type: _.find(DEVICE_SELECTS, {
        label: _.upperFirst(pathname.slice(1)) as DEVICE_TYPE,
      })?.value.toString(),
    },
    sort: 'title',
  })
  useEffect(() => {
    let status = (error as any)?.status
    if (status == 'FETCH_ERROR' || status === 401) {
      logOut()
    }
  }, [error])

  return (
    <div className={`fade camera `}>
      <Row className={'navigation'} align="top" justify="space-between" wrap={false}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Cameras</h2>
            </Col>
            {!xs && (
              <Col>
                <span className={'navigationFoundText'}>{devicesData?.length ? `Found ${devicesData?.length} Cameras` : 'No found Cameras'}</span>
              </Col>
            )}
          </Row>
        </Col>
        {isOwner || isAdmin || isAgent || isCustomer ? (
          <Col>
            <Row justify="space-between" align="middle" wrap={false}>
              <Col>
                <Button icon={<Plus />} type="link" className={'navigationAddButton'} onClick={() => setAddCameraModal(true)}>
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
          <div className={classes.deviceRow}>
            {devicesData?.map((device) => (
              <DeviceCard
                key={device.id}
                data={device}
                title={device?.title}
                visible={updateCameraModal}
                setVisibleModal={setUpdateCameraModal}
                role_policy={isOwner || isAdmin || isAgent || isCustomer}
              />
            ))}
          </div>
        ) : (
          <NoData />
        )}
        {addCameraModal && <AddCameraModal visible={addCameraModal} setVisible={setAddCameraModal} />}
        {updateCameraModal && <UpdateCameraModal visible={updateCameraModal} setVisible={setUpdateCameraModal} />}
      </div>
    </div>
  )
}
export default memo(Camera)
