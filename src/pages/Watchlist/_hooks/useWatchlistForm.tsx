import { useEffect, useState } from 'react'
import { Col, Form, Row, Tabs, Tag } from 'antd'
import toast from 'react-hot-toast'

import { useAppSelector } from 'store/hooks'
import { Button, FormElements } from 'components'
import { useAddWatchlistMutation, useUpdateWatchlistMutation } from 'store/endpoints'
import { useGetRole } from 'hooks'
import { IWatchlistDTO } from 'types'
import { X } from 'tabler-icons-react'

export type Props = {
  data?: IWatchlistDTO
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

interface IRate {
  time: string
  price: string
}

const intialRate = { price: '', time: '' }

const useWatchlistForm = ({ data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const [rate, setRate] = useState<IRate>(intialRate)
  const [rateTags, setRateTags] = useState<IRate[]>([])

  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { isOwner, isAdmin } = useGetRole()

  const [addMutation, { isLoading }] = useAddWatchlistMutation()
  const [updateMutation, { isLoading: updateLoading }] = useUpdateWatchlistMutation()

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setRate(intialRate)
    }
  })

  useEffect(() => {
    form.setFieldsValue({
      title: data?.title,
    })

    const arr1: any[] = data?.extra_field?.split(':')?.map((item: string) => item.split('-'))

    const arr2 = (arr1 || [])?.map((item) => ({
      time: item[0],
      price: item[1],
    }))
    arr2[0]?.price && arr2[0]?.time && setRateTags(arr2)
  }, [data, form, visible])

  const onFinish = (values: any) => {
    const formData = {
      id: data?.id,
      title: values.title,
      edge_id: currentEdge?.id,
      extra_field: rateTags.map((tag) => `${tag.time}-${tag.price}`).join(':'),
    }

    if (isOwner || isAdmin) {
      if (data) {
        const mutationPromise = updateMutation({
          watchlist_id: data?.id,
          ...formData,
        }).unwrap()
        toast
          .promise(mutationPromise, {
            loading: `updating watchlist...`,
            success: `successfully updated`,
            error: ({ data }) => data?.error,
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
            error: ({ data }) => data?.error,
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

  const onChangeInput = (name: string, value: string) => {
    setRate((prev) => ({ ...prev, [name]: value }))
  }

  const onAddTag = () => {
    rate.time && rate.price && setRateTags((prev) => [...prev, { time: rate?.time, price: rate?.price }])
  }

  const onFilterTags = (price: string) => {
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
                <Row gutter={12} align="middle" justify="space-between">
                  <Col span={10}>
                    <Form.Item name="time" label="Enter minutes">
                      <FormElements.Input
                        size="large"
                        placeholder="Minute: 10"
                        value={rate.time}
                        onChange={(e) => onChangeInput('time', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item name="price" label="Enter price">
                      <FormElements.Input
                        size="large"
                        placeholder="Sum: 3 000"
                        value={rate.price}
                        onChange={(e) => onChangeInput('price', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button size="large" type="ghost" fullWidth onClick={onAddTag}>
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
