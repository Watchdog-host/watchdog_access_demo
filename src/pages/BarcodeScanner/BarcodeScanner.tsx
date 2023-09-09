import { FC, ReactNode, memo, useEffect, useState } from 'react'

import { Col, Empty, Grid, Row } from 'antd'
import { useDeleteDeviceMutation, useDevicesQuery } from 'store/endpoints'
import { useAppSelector } from 'store/hooks'
import { useLocation } from 'react-router-dom'
import { useGetRole } from 'hooks'
import { DEVICE_SELECTS } from 'constants/common'
import { DEVICE_TYPE, IDeviceDTO } from 'types'
import _ from 'lodash'

import classes from './BarcodeScanner.module.scss'
import { Button, DeviceCard, Loader, NoData } from 'components'
import { toast } from 'react-hot-toast'
import { Plus } from 'tabler-icons-react'
import AddBarcodeScannerModal from './_components/AddBarcodeScannerModal'
import UpdateBarcodeScannerModal from './_components/UpdateBarcodeScannerModal'
import { logOut } from 'utils'

type Props = {
  children?: ReactNode
}

const BarcodeScanner: FC<Props> = () => {
  const [addBarcodeScannerModal, setAddBarcodeScannerModal] = useState<boolean>(false)
  const [updateBarcodeScannerModal, setUpdateBarcodeScannerModal] = useState<boolean>(false)
  const [addDescriptor, setAddDescriptor] = useState<boolean>(false)
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
              <h2>Barcode scanners</h2>
            </Col>
            {!xs && (
              <Col>
                <span className={'navigationFoundText'}>{devicesData?.length ? `Found ${devicesData?.length} Barcode scanners` : 'No found Barcode scanners'}</span>
              </Col>
            )}
          </Row>
        </Col>
        {isOwner || isAdmin ? (
          <Col>
            <Row justify="space-between" align="middle" wrap={false}>
              <Col>
                <Button icon={<Plus />} type="link" className={'navigationAddButton'} onClick={() => setAddBarcodeScannerModal(true)}>
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
                visible={updateBarcodeScannerModal}
                setVisibleModal={setUpdateBarcodeScannerModal}
                role_policy={isOwner || isAdmin || isAgent || isCustomer}
              />
            ))}
          </div>
        ) : (
          <NoData />
        )}

        {addBarcodeScannerModal && <AddBarcodeScannerModal visible={addBarcodeScannerModal} setVisible={setAddBarcodeScannerModal} />}
        {updateBarcodeScannerModal && <UpdateBarcodeScannerModal visible={updateBarcodeScannerModal} setVisible={setUpdateBarcodeScannerModal} />}
      </div>
    </div>
  )
}

export default memo(BarcodeScanner)
