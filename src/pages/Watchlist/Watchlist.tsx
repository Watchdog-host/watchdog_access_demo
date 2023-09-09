import { FC, ReactNode, memo, useEffect, useState } from 'react'
import { Col, Row, Divider, Grid } from 'antd'
import toast from 'react-hot-toast'

import { Button, List, Loader } from 'components'
import { useDeleteWatchlistMutation, useWatchlistsQuery } from 'store/endpoints'
import { useGetRole } from 'hooks'
import { useAppSelector } from 'store/hooks'
import { IEdgeDTO, IWatchlistDTO } from 'types'
import { IListDataSource } from 'components/List/List'
import AddWatchlistModal from './_components/AddWatchlistModal'
import UpdateWatchlistModal from './_components/UpdateWatchlistModal'
import _ from 'lodash'
import classes from './Watchlist.module.scss'
import { Plus } from 'tabler-icons-react'
import { logOut } from 'utils'

type Props = {
  children?: ReactNode
}

const Watchlist: FC<Props> = () => {
  const [addWatchlist, setAddWatchlist] = useState<boolean>(false)
  const [updateWatchlist, setUpdateWatchlist] = useState<boolean>(false)
  const [selectedWatchlist, setSelectedWatchlist] = useState<IWatchlistDTO>()
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [deleteMutation] = useDeleteWatchlistMutation()

  const {
    data: watchlistsData,
    isFetching,
    error,
  } = useWatchlistsQuery({
    filter: {
      id: currentEdge?.id || 0,
    },
  })

  const onDelete = () => {
    if (isOwner || isAdmin || isAgent || isCustomer) {
      const mutationPromise = deleteMutation({
        id: selectedWatchlist?.id,
      }).unwrap()
      toast.promise(mutationPromise, {
        loading: `deleting watchlist...`,
        success: `successfully delete`,
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

  return (
    <div className={`fade`}>
      <Row className={'navigation'} align="middle" justify="space-between" wrap={false}>
        <Col>
          <Row align="middle" wrap={false}>
            <Col>
              <h2>Watchlists</h2>
            </Col>

            {!xs && (
              <Col>
                <span className={'navigationFoundText'}>{watchlistsData?.length ? `Found ${watchlistsData?.length} Watchlists` : 'No found Watchlist'}</span>
              </Col>
            )}
          </Row>
        </Col>

        {isOwner || isAdmin || isAgent || isCustomer ? (
          <Col>
            <Row justify="space-between" wrap={false}>
              <Col>
                <Button icon={<Plus />} type="link" className={'navigationAddButton'} onClick={() => setAddWatchlist(true)}>
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>

      <div className="dataWrapper">
        <Loader spinning={isFetching || !watchlistsData?.length}>
          {watchlistsData?.map((watchlist, index) => {
            if (!watchlist.watchlists?.length) return
            return (
              <div key={watchlist.title}>
                <Divider orientation="center">{_.upperFirst(watchlist.title)}</Divider>
                <List
                  dataSource={
                    watchlist.watchlists?.map((item, i) => ({
                      key: item?.id || i,
                      title: item?.title,
                      link: `/Watchlists/${item.id}/identities`,
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
            )
          })}
        </Loader>
      </div>

      {addWatchlist && <AddWatchlistModal visible={addWatchlist} setVisible={setAddWatchlist} />}
      {updateWatchlist && <UpdateWatchlistModal visible={updateWatchlist} setVisible={setUpdateWatchlist} data={selectedWatchlist} />}
    </div>
  )
}

export default memo(Watchlist)
