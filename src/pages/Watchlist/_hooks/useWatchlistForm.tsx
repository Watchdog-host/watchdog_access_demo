import { useEffect, useState } from 'react'
import { Col, Form, Grid, Row, Tag } from 'antd'
import toast from 'react-hot-toast'

import { useAppSelector } from 'store/hooks'
import { Button, FormElements, Tabs } from 'components'
import { useAddWatchlistMutation, useUpdateWatchlistMutation } from 'store/endpoints'
import { useGetRole } from 'hooks'
import { IWatchlistDTO } from 'types'
import { X } from 'tabler-icons-react'
import { logOut, validateMinutes, validatePrice } from 'utils'
import { valueType } from 'antd/es/statistic/utils'
import { WatchlistTypeEnum } from 'constants/enums'

export type Props = {
  data?: IWatchlistDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

interface IRate {
  time: number | null
  price: number | null
}

const intialRate = { price: null, time: null }

const useWatchlistForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const [rate, setRate] = useState<IRate>(intialRate)
  const [rateTags, setRateTags] = useState<IRate[]>([])
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin, isAgent, isCustomer } = useGetRole()

  const [addMutation, { isLoading }] = useAddWatchlistMutation()
  const [updateMutation, { isLoading: updateLoading }] = useUpdateWatchlistMutation()

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setRate(intialRate)
    }
    if (data) {
      const extra_field = data?.extra_field && JSON.parse(data?.extra_field || {})
      const arr1: any[] = extra_field?.pricelist?.split(':')?.map((item: string) => item.split('-'))
      const arr2 = (arr1 || [])?.map((item) => ({
        time: item[0],
        price: item[1],
      }))
      arr2[0]?.price && arr2[0]?.time && setRateTags(arr2)

      form.setFieldsValue({
        title: data?.title,
        penalty: extra_field?.penalty,
      })
    }
  }, [data, form, visible])

  const onFinish = (values: any) => {
    const extra_field = JSON.stringify({
      pricelist: rateTags.map((tag) => `${tag.time}-${tag.price}`).join(':'),
      penalty: values.penalty ?? undefined,
    })
    const formData = {
      id: data?.id,
      type: WatchlistTypeEnum.Timely,
      title: values.title,
      edge_id: currentEdge?.id,
      extra_field: extra_field,
    }
    if (isOwner || isAdmin || isAgent || isCustomer) {
      if (data) {
        const mutationPromise = updateMutation({
          watchlist_id: data?.id,
          ...formData,
        }).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `updating watchlist...`,
            success: `successfully updated`,
            error: (error) => {
              if (error?.status == 'FETCH_ERROR' || error?.status === 401) {
                logOut()
                return error?.error || error?.data?.error
              }
              return error?.data?.error
            },
          })
          .then(() => {
            setVisible?.(false)
          })
      } else {
        const mutationPromise = addMutation(formData).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `adding watchlist...`,
            success: `successfully added`,
            error: (error) => {
              if (error?.status == 'FETCH_ERROR' || error?.status === 401) {
                logOut()
                return error?.error || error?.data?.error
              }
              return error?.data?.error
            },
          })
          .then(() => {
            setVisible?.(false)
            form.resetFields()
            setRate(intialRate)
          })
      }
    } else {
      toast.error('Permission denied!')
    }
  }

  const onChangeInput = (name: string, value: valueType | null) => {
    setRate((prev) => ({ ...prev, [name]: value }))
  }

  const onAddTag = () => {
    rate.time !== null && rate.price !== null && setRateTags((prev) => [...prev, { time: rate?.time, price: rate?.price }])
  }

  const onFilterTags = (price: number | null) => {
    setRateTags(() => rateTags.filter((item) => item.price !== price))
  }

  const disabled = data?.title?.toLowerCase() === 'unknown'
  const watchlistForm = (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Tabs
        items={[
          {
            key: '1',
            label: 'General',
            children: (
              <Form.Item name="title" label="Title:" rules={[{ required: true, message: '*Title is required' }]}>
                <FormElements.Input disabled={disabled} size="large" />
              </Form.Item>
            ),
          },
          {
            key: '2',
            label: 'Price list',
            children: (
              <>
                <Row gutter={xs ? 8 : 12} align="top">
                  <Col span={xs ? 9 : 10}>
                    <Form.Item name="time" label="Minutes" rules={[{ validator: validateMinutes }]}>
                      <FormElements.InputNumber min={0} max={525600} size="large" placeholder="e.g., 5" value={rate.time} onChange={(e) => onChangeInput('time', e)} />
                    </Form.Item>
                  </Col>
                  <Col span={xs ? 9 : 10}>
                    <Form.Item name="price" label="Price" rules={[{ validator: validatePrice }]}>
                      <FormElements.InputNumber min={0} size="large" placeholder="e.g., 3 000" value={rate.price} onChange={(e) => onChangeInput('price', e)} />
                    </Form.Item>
                  </Col>
                  <Col style={{ marginTop: 28 }} span={xs ? 6 : 4}>
                    <Button size="large" type="primary" fullWidth onClick={onAddTag}>
                      Add
                    </Button>
                  </Col>
                </Row>

                {rateTags.length > 0 && (
                  <Row style={{ marginBottom: 20, minHeight: 40 }}>
                    {rateTags.map((tag, i) => (
                      <Col key={i}>
                        <Tag
                          style={{
                            fontSize: 14,
                            padding: '5px',
                            borderRadius: 5,
                            marginTop: 5,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {tag.time} min - {tag.price} sum
                          <span>
                            <X
                              size={16}
                              onClick={() => onFilterTags(tag.price)}
                              style={{
                                marginTop: 5,
                                marginLeft: 5,
                                cursor: 'pointer',
                              }}
                            />
                          </span>
                        </Tag>
                      </Col>
                    ))}
                  </Row>
                )}
                <Col span={24}>
                  <Form.Item name="penalty" label="Penalty price" rules={[{ validator: validatePrice }]}>
                    <FormElements.InputNumber min={0} size="large" placeholder="e.g., 0" />
                  </Form.Item>
                </Col>
              </>
            ),
          },
        ]}
      />

      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading || updateLoading}>
        Submit
      </Button>
    </Form>
  )

  return watchlistForm
}

export default useWatchlistForm
