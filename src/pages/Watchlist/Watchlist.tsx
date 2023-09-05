import { FC, ReactNode, memo, useEffect, useState } from 'react'
import { Col, Row, Divider } from 'antd'
import toast from 'react-hot-toast'

import { Button, List, Loader } from 'components'
import { useDeleteWatchlistMutation, useWatchlistsQuery } from 'store/endpoints'
import { useGetRole } from 'hooks'
import { useAppSelector } from 'store/hooks'
import { IWatchlistDTO } from 'types'
import { IListDataSource } from 'components/List/List'
import AddWatchlistModal from './_components/AddWatchlistModal'
import UpdateWatchlistModal from './_components/UpdateWatchlistModal'
import _ from 'lodash'
import classes from './Watchlist.module.scss'
import { Plus } from 'tabler-icons-react'

type Props = {
  children?: ReactNode
}

const Watchlist: FC<Props> = () => {
  const [addWatchlist, setAddWatchlist] = useState<boolean>(false)
  const [updateWatchlist, setUpdateWatchlist] = useState<boolean>(false)
  const [selectedWatchlist, setSelectedWatchlist] = useState<IWatchlistDTO>()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()

  const [deleteMutation] = useDeleteWatchlistMutation()
  const { data: watchlistsData, refetch, isFetching } = useWatchlistsQuery()

  useEffect(() => {
    refetch()
  }, [currentEdge])

  const onDelete = () => {
    if (isOwner || isAdmin) {
      const mutationPromise = deleteMutation({
        id: selectedWatchlist?.id,
      }).unwrap()
      toast.promise(mutationPromise, {
        loading: `deleting watchlist...`,
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
              <h2>Watchlists</h2>
            </Col>
            <Col>
              <span className={'navigationFoundText'}>
                {watchlistsData?.length ? `Found ${watchlistsData?.length} Watchlists` : 'No found Watchlist'}
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
                  onClick={() => setAddWatchlist(true)}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>

      <div className="dataWrapper">
        <Loader spinning={isFetching || !watchlistsData?.length}>
          {watchlistsData?.map((watchlist, index) => (
            <div key={watchlist.title}>
              <Divider orientation="center">{_.upperFirst(watchlist.title)}</Divider>
              <List
                dataSource={
                  watchlist.watchlists?.map((item, i) => ({
                    key: item?.id || i,
                    title: item?.title,
                    link: `/watchlist/${item.id}/identities`,
                    data: item,
                    hasAccess: watchlistsData[index].title === currentEdge?.title,
                  })) as IListDataSource[]
                }
                setSelected={setSelectedWatchlist}
                setVisibleModal={setUpdateWatchlist}
                onDelete={onDelete}
                role_policy={isOwner || isAdmin || isAgent || isCustomer}
              />
            </div>
          ))}
        </Loader>
      </div>

      {addWatchlist && <AddWatchlistModal visible={addWatchlist} setVisible={setAddWatchlist} />}
      {updateWatchlist && (
        <UpdateWatchlistModal visible={updateWatchlist} setVisible={setUpdateWatchlist} data={selectedWatchlist} />
      )}
    </div>
  )
}

export default memo(Watchlist)
