import { FC, ReactNode, memo, useEffect, useState } from 'react'
import { Col, Grid, Row } from 'antd'
import toast from 'react-hot-toast'

import { Button, List, Loader, NoData } from 'components'
import { IAccountDTO, IProfileDTO } from 'types'
import { useAppSelector } from 'store/hooks'
import { IListDataSource } from 'components/List/List'
import { useGetRole } from 'hooks'
import { ROLE_STEPS } from 'constants/common'
import { useAccountsQuery, useDeleteAccountMutation } from 'store/endpoints'
import AddAccountModal from './_components/AddAccountModal'
import UpdateAccountModal from './_components/UpdateAccountModal'

import classes from './Accounts.module.scss'
import { Plus } from 'tabler-icons-react'
import { useLocalStorage } from 'react-use'
import { logOut } from 'utils'

type Props = {
  children?: ReactNode
}

const Accounts: FC<Props> = () => {
  const [addAccountModal, setAddAccountModal] = useState<boolean>(false)
  const [updateAccountModal, setUpdateAccountModal] = useState<boolean>(false)
  const [selectedAccount, setSelectedAccount] = useState<IAccountDTO>()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()

  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const {
    data: accountsData,
    isSuccess,
    error,
  } = useAccountsQuery({
    edge_id: currentEdge?.id || 0,
    type: localProfile?.type || 0,
  })

  const [deleteMutation] = useDeleteAccountMutation()
  const onDelete = () => {
    if (isOwner || isAdmin || isAgent || isCustomer) {
      const mutationPromise = deleteMutation({
        account_id: selectedAccount?.id,
      }).unwrap()
      toast.promise(mutationPromise, {
        loading: `deleting...`,
        success: `successfully deleted`,
        error: (error) => {
          if (error?.status == 'FETCH_ERROR' || error?.status === 401) {
            logOut()
            return error?.error || error?.data?.error
          }
          return error?.data?.error
        },
      })
    } else {
      toast.error('Permission denied!')
    }
  }
  useEffect(() => {
    let status = (error as any)?.status
    if (status == 'FETCH_ERROR' || status === 401) {
      logOut()
    }
  }, [error])

  const listData = accountsData?.map((account) => ({
    key: account.id,
    image: account.image,
    title: account.title,
    description: account.email,
    type: ROLE_STEPS[account.type],
    hasAccess: true,
    data: account,
  })) as IListDataSource[]

  return (
    <div className={`fade`}>
      <Row className="navigation" align="middle" justify="space-between" wrap={false}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Accounts</h2>
            </Col>
            {!xs && (
              <Col>
                <span className="navigationFoundText">{accountsData?.length ? `Found ${accountsData?.length} Accounts` : 'No found Accounts'}</span>
              </Col>
            )}
          </Row>
        </Col>

        {isOwner || isAdmin || isAgent || isCustomer ? (
          <Col>
            <Row justify="space-between" wrap={false}>
              <Col>
                <Button icon={<Plus />} type="link" className="navigationAddButton" onClick={() => setAddAccountModal(true)}>
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
        ) : accountsData?.length ? (
          <List
            dataSource={listData}
            setVisibleModal={setUpdateAccountModal}
            setSelected={setSelectedAccount}
            onDelete={onDelete}
            role_policy={isOwner || isAdmin || isAgent || isCustomer}
          />
        ) : (
          <NoData />
        )}
      </div>
      {addAccountModal && <AddAccountModal visible={addAccountModal} setVisible={setAddAccountModal} />}
      {updateAccountModal && <UpdateAccountModal visible={updateAccountModal} setVisible={setUpdateAccountModal} data={selectedAccount} />}
    </div>
  )
}

export default memo(Accounts)
