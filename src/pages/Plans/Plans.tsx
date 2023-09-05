import { FC, ReactNode, useState } from 'react'

import { Grid, Row } from 'antd'
import Col from 'antd/lib/grid/col'
import { useGetRole } from 'hooks'
import { Button, Loader, NoData, PlanCard } from 'components'
import { Plus } from 'tabler-icons-react'
import { IPlanDTO } from 'types'
import AddPlanModal from './_components/AddPlanModal'
import UpdatePlanModal from './_components/UpdatePlanModal'
import { useDeletePlanMutation, usePlansQuery } from 'store/endpoints'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import classes from './Plans.module.scss'
type Props = {
  children?: ReactNode
}

const Plans: FC<Props> = () => {
  const [selectedPlan, setSelectedPlan] = useState<IPlanDTO>()
  const [addPlanModal, setAddPlanModal] = useState<boolean>(false)
  const [updatePlanModal, setUpdatePlanModal] = useState<boolean>(false)
  const { isOwner, isAdmin } = useGetRole()
  const { useBreakpoint } = Grid
  const { xs, md, xxl } = useBreakpoint()
  const { pathname } = useLocation()

  const { data: plansData, isSuccess } = usePlansQuery()

  const [deleteMutation] = useDeletePlanMutation()
  const onDelete = () => {
    if (isOwner || isAdmin) {
      const mutationPromise = deleteMutation({
        id: selectedPlan?.id,
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
      <Row className="navigation" align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Plans</h2>
            </Col>

            <Col>
              <span className={'navigationFoundText'}>
                {plansData?.length ? `Found ${plansData?.length} Plans` : 'No found Plans'}
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
                  onClick={() => setAddPlanModal(true)}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>

      <div className={'dataWrapper'}>
        {!isSuccess && plansData?.length ? (
          <Loader />
        ) : plansData?.length ? (
          <Row gutter={[12, 12]}>
            {plansData?.map((plan) => (
              <Col span={xs ? 24 : md ? 12 : xxl ? 6 : 12} key={plan.id}>
                <PlanCard
                  data={plan}
                  visible={updatePlanModal}
                  setSelected={setSelectedPlan}
                  setVisibleModal={setUpdatePlanModal}
                  onDelete={onDelete}
                  role_policy={isOwner||isAdmin}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <NoData />
        )}
        {addPlanModal && <AddPlanModal visible={addPlanModal} setVisible={setAddPlanModal} />}
        {updatePlanModal && (
          <UpdatePlanModal visible={updatePlanModal} setVisible={setUpdatePlanModal} data={selectedPlan} />
        )}
      </div>
    </div>
  )
}

export default Plans
