import { FC, ReactNode, memo, useState } from 'react'
import { Col, Empty, Row } from 'antd'
import toast from 'react-hot-toast'

import { Button, List, Loader, NoData } from 'components'
import { IAccountDTO } from 'types'
import { useAppSelector } from 'store/hooks'
import { IListDataSource } from 'components/List/List'
import { useGetRole } from 'hooks'
import { ROLE_STEPS } from 'constants/common'
import { useAccountsQuery, useDeleteAccountMutation, useProfileQuery } from 'store/endpoints'
import AddAccountModal from './_components/AddAccountModal'
import UpdateAccountModal from './_components/UpdateAccountModal'

import classes from './Accounts.module.scss'
import { Plus } from 'tabler-icons-react'

type Props = {
  children?: ReactNode
}

const Accounts: FC<Props> = () => {
  const [addAccountModal, setAddAccountModal] = useState<boolean>(false)
  const [updateAccountModal, setUpdateAccountModal] = useState<boolean>(false)
  const [selectedAccount, setSelectedAccount] = useState<IAccountDTO>()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()

  const { data: profileData } = useProfileQuery()
  const { data: accountsData, isSuccess } = useAccountsQuery({ edge_id: currentEdge?.id || 0, type: profileData?.type || 0 })

  const [deleteMutation] = useDeleteAccountMutation()
  const onDelete = () => {
    if (isOwner || isAdmin) {
      const mutationPromise = deleteMutation({
        account_id: selectedAccount?.id,
      }).unwrap()

      toast.promise(mutationPromise, {
        loading: `deleting...`,
        success: `successfully deleted`,
        error: ({ data }) => data?.error,
      })
    } else {
      toast.error('Permission denied!')
    }
  }

  const listData = accountsData?.map((account) => ({
    key: account.id,
    avatar: account.title,
    title: account.title,
    description: account.email,
    type: ROLE_STEPS[account.type],
    hasAccess: true,
    data: account,
  })) as IListDataSource[]

  return (
    <div className={`fade container`}>
      <Row className="navigation" align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Accounts</h2>
            </Col>

            <Col>
              <span className="navigationFoundText">
                {accountsData?.length ? `Found ${accountsData?.length} Accounts` : 'No found Accounts'}
              </span>
            </Col>
          </Row>
        </Col>

        {isOwner || isAdmin || isAgent || isCustomer ? (
          <Col>
            <Row justify="space-between" wrap={false}>
              <Col>
                <Button
                  icon={<Plus />}
                  type="link"
                  className="navigationAddButton"
                  onClick={() => setAddAccountModal(true)}
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
      {updateAccountModal && (
        <UpdateAccountModal visible={updateAccountModal} setVisible={setUpdateAccountModal} data={selectedAccount} />
      )}
    </div>
  )
}

export default memo(Accounts)
