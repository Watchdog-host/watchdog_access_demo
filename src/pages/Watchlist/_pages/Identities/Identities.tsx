import React, { FC, ReactNode, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from 'antd'
import toast from 'react-hot-toast'

import { Button, List, Loader, NoData } from 'components'
import { IIdentityDTO } from 'types'
import { useDeleteIdentityMutation, useIdentitiesQuery } from 'store/endpoints'
import { ChevronLeft, Plus } from 'tabler-icons-react'
import { IListDataSource } from 'components/List/List'
import AddIdentityModal from './_components/AddIdentityModal'
import UpdateIdentityModal from './_components/UpdateIdentityModal'
import { useGetRole } from 'hooks'

import classes from './Identities.module.scss'

type Props = {
  children?: ReactNode
}

const Identities: FC<Props> = () => {
  const [addIdentity, setAddIdentity] = useState<boolean>(false)
  const [updateIdentity, setUpdateIdentity] = useState<boolean>(false)
  const [selectedIdentity, setSelectedIdentity] = useState<IIdentityDTO>()

  const navigate = useNavigate()
  const { id: watchlist_id } = useParams()
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()

  const [deleteMutation] = useDeleteIdentityMutation()
  const identitiesQuery = useIdentitiesQuery({
    watchlist_id: Number(watchlist_id),
  })
  const identitiesData = identitiesQuery.data

  const identities = identitiesData?.map((data) => ({
    key: data.id,
    title: data.title,
    data: data,
    hasAccess: true,
  })) as IListDataSource[]

  const onDelete = () => {
    const mutationPromise = deleteMutation({
      id: selectedIdentity?.id,
    }).unwrap()

    toast.promise(mutationPromise, {
      loading: `deleting identity...`,
      success: `successfully delete`,
      error: ({ data }) => data?.error,
    })
  }

  return (
    <div className='fade container'>
      <Row className={'navigation'} align="middle" justify="space-between">
        <Col>
          <Row align="middle" wrap={false} gutter={16}>
            <Col>
              <Button icon={<ChevronLeft />} onlyIcon onClick={() => navigate(-1)} />
            </Col>
            <Col>
              <h2>Identities</h2>
            </Col>
            <Col>
              <span className={'navigationFoundText'}>
                {identitiesData?.length ? `Found ${identitiesData?.length} Identities` : 'No found Identities'}
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
                  className={'navigationAddButton'}
                  onClick={() => setAddIdentity(true)}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>
      <div className={classes.dataWrapper}>
        {!identitiesQuery.isSuccess ? (
          <Loader />
        ) : identities?.length ? (
          <List
            dataSource={identities}
            setSelected={setSelectedIdentity}
            setVisibleModal={setUpdateIdentity}
            onDelete={onDelete}
            role_policy={isOwner || isAdmin || isAgent || isCustomer}
          />
        ) : (
          <NoData />
        )}
      </div>
      {addIdentity && <AddIdentityModal visible={addIdentity} setVisible={setAddIdentity} />}
      {updateIdentity && (
        <UpdateIdentityModal visible={updateIdentity} setVisible={setUpdateIdentity} data={selectedIdentity} />
      )}
    </div>
  )
}

export default Identities
