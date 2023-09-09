import { FC, ReactNode, memo, useEffect, useState } from 'react'

import { Col, Empty, Grid, Row } from 'antd'
import { useDeleteDeviceMutation, useDevicesQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'
import { useLocation } from 'react-router-dom'
import { useGetRole } from 'hooks'
import { DEVICE_SELECTS } from 'constants/common'
import { DEVICE_TYPE, IDeviceDTO } from 'types'
import _ from 'lodash'

import classes from './LEDMatrix.module.scss'
import { Button, DeviceCard, Loader, NoData } from 'components'
import { toast } from 'react-hot-toast'
import { Plus } from 'tabler-icons-react'
import AddLEDMatrixModal from './_components/AddLEDMatrixModal'
import UpdateLEDMatrixModal from './_components/UpdateLEDMatrixModal'
import { logOut } from 'utils'

type Props = {
  children?: ReactNode
}

const LEDMatrix: FC<Props> = () => {
  const [addLEDMatrixModal, setAddLEDMatrixModal] = useState<boolean>(false)
  const [updateLEDMatrixModal, setUpdateLEDMatrixModal] = useState<boolean>(false)
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
    <div className={`fade`}>
      <Row className={'navigation'} align="middle" justify="space-between" wrap={false}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>LEDMatrixes</h2>
            </Col>

            {!xs && (
              <Col>
                <span className={'navigationFoundText'}>{devicesData?.length ? `Found ${devicesData?.length} LEDMatrixes` : 'No found LEDMatrixes'}</span>
              </Col>
            )}
          </Row>
        </Col>
        {isOwner || isAdmin ? (
          <Col>
            <Row justify="space-between" align="middle" wrap={false}>
              <Col>
                <Button icon={<Plus />} type="link" className={'navigationAddButton'} onClick={() => setAddLEDMatrixModal(true)}>
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
                data={device}
                title={device?.title}
                visible={updateLEDMatrixModal}
                setVisibleModal={setUpdateLEDMatrixModal}
                role_policy={isOwner || isAdmin || isAgent || isCustomer}
              />
            ))}
          </div>
        ) : (
          <NoData />
        )}
        {addLEDMatrixModal && <AddLEDMatrixModal visible={addLEDMatrixModal} setVisible={setAddLEDMatrixModal} />}
        {updateLEDMatrixModal && <UpdateLEDMatrixModal visible={updateLEDMatrixModal} setVisible={setUpdateLEDMatrixModal} />}
      </div>
    </div>
  )
}

export default memo(LEDMatrix)
