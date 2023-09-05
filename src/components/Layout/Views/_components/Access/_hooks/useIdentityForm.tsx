import { useEffect, useState } from 'react'
import { Col, Form, Row, Tabs, Tag } from 'antd'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Button, FormElements } from 'components'
import _ from 'lodash'
import { X } from 'tabler-icons-react'
import {
  useAddDescriptorMutation,
  useAddIdentityMutation,
  useDeleteDescriptorMutation,
  useDescriptorQuery,
  useUpdateIdentityMutation,
  useWatchlistsQuery,
} from 'store/endpoints'
import { GENDER_SELECTS } from 'constants/common'
import { useGetRole } from 'hooks'
import { IAccessDTO, IIdentityDTO } from 'types'
import { DescriptorTypeEnum } from 'constants/enums'

export type Props = {
  data?: IAccessDTO
  type?: 'PUT' | 'POST'
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

type TagType = {
  data: string
  type: number
  id: number | null
}

const useIdentityForm = ({ type, data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const [plateNumber, setPlateNumber] = useState<string>('')
  const [barcodeNumber, setBarcodeNumber] = useState<string>('')
  const [tab, setTab] = useState<any>('')
  const [tags, setTags] = useState<TagType[]>([])
  const [deletedTags, setDeletedTags] = useState<TagType[]>([])
  const { isOwner, isAdmin } = useGetRole()

  const [addAddIdentityMutation, { isLoading: isIdentityLoading }] = useAddIdentityMutation()
  const [addAddDescriptorMutation, { isLoading: isDescriptorLoading }] = useAddDescriptorMutation()
  const [deleteDescriptorMutation, { isLoading: isDescriptorDeleteLoading }] = useDeleteDescriptorMutation()
  const { data: watchlistsData, refetch, isFetching } = useWatchlistsQuery()

  //fixme
  const { data: descriptorData } = useDescriptorQuery({ identity_id: data?.identity_id })

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setPlateNumber('')
      setBarcodeNumber('')
    }
  }, [visible])

  // useEffect(() => {
  //   form.setFieldsValue({
  //     [data?.descriptor_type === DescriptorTypeEnum.Face ? 'license_plate' : 'barcode']: data?.descriptor
  //   })
  // }, [data, visible])

  useEffect(() => {
    if (descriptorData) {
      setTags(descriptorData.map(({ data, type, id }) => ({ data, type, id })))
    }
  }, [descriptorData])

  const onFinish = (values: any) => {
    const formDataIdentity = {
      id: data?.id,
      title: values.title,
      type: values.type || 0,
      birthdate: values.birthdate,
      watchlist_id: 1,
    }

    // console.log(formDataIdentity);
    console.log(data)

    // if (isOwner || isAdmin ) {
    //   if (data && type == 'POST') {
    //     const mutationPromises = addAddIdentityMutation(formDataIdentity)
    //       .unwrap()
    //       .then((identityData) => {
    //         const changedItems = tags.filter((item) => !item.id).concat(deletedTags)
    //         for (let i = 0; i < changedItems.length; i++) {
    //           if (changedItems[i].id) {
    //             deleteDescriptorMutation({ id: deletedTags[i].id })
    //           } else {
    //             addAddDescriptorMutation({
    //               identity_id: identityData.id,
    //               data: tags[i].data.trim(),
    //               type: tags[i].type,
    //             }).unwrap()
    //           }
    //         }
    //       })
    //     toast
    //       .promise(mutationPromises, {
    //         loading: `adding identity...`,
    //         success: `successfully added`,
    //         error: ({ data }) => data?.error,
    //       })
    //       .then(() => {
    //         setVisible?.(false)
    //         form.resetFields()
    //       })
    //   }
    // } else {
    //   toast.error('Permission denied!')
    // }
  }

  const onAddTag = (number: string) => {
    if (number.trim().length) {
      setTags((prev) => [...prev, { data: number.trim(), type: Number(DescriptorTypeEnum[tab]), id: null }])
      form.resetFields(['barcode', 'license_plate'])
      setPlateNumber('')
      setBarcodeNumber('')
    }
  }
  const onFilterTags = (tag: TagType) => {
    setTags(() => tags?.filter((item) => item.data !== tag.data))
    setDeletedTags((prev) => [...prev, tag])
  }

  const indetityForm = (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Tabs
        onTabClick={(tab, e) =>
          setTab(
            _.upperFirst(
              (e.target as HTMLDivElement).innerText.split(' ')[1] || (e.target as HTMLDivElement).innerText,
            ),
          )
        }
        items={[
          {
            key: '1',
            label: 'General',
            children: (
              <>
                <Form.Item name="title" label="Title:" rules={[{ required: true, message: '*Title is required' }]}>
                  <FormElements.Input size="large" />
                </Form.Item>

                <Form.Item name="type" label="Gender:">
                  <FormElements.Select options={GENDER_SELECTS} />
                </Form.Item>

                <Form.Item name="birthdate" label="Birthdate:">
                  <FormElements.DatePicker />
                </Form.Item>
              </>
            ),
          },
          {
            key: '2',
            label: 'Barcode',
            children: (
              <>
                <Row gutter={12} align="middle" justify="space-between">
                  <Col span={20}>
                    <Form.Item name="barcode" label="Enter Barcode data:">
                      <FormElements.Input
                        size="large"
                        placeholder="01A234BC"
                        value={barcodeNumber}
                        onChange={(e) => setBarcodeNumber(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button size="large" type="ghost" fullWidth onClick={() => onAddTag(barcodeNumber)}>
                      Add
                    </Button>
                  </Col>
                </Row>

                {tags.length > 0 && (
                  <Row style={{ marginBottom: 20, minHeight: 40 }}>
                    {tags
                      .filter(({ type }) => type === Number(DescriptorTypeEnum[tab]))
                      .map((tag, i) => (
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
                            <span>{tag.data}</span>
                            <span>
                              <X
                                size={16}
                                onClick={() => onFilterTags(tag)}
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
          {
            key: '3',
            label: 'License plate',
            children: (
              <>
                <Row gutter={12} align="middle" justify="space-between">
                  <Col span={20}>
                    <Form.Item name="license_plate" label="Enter car license plate:">
                      <FormElements.Input
                        size="large"
                        placeholder="01A234BC"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button size="large" type="ghost" fullWidth onClick={() => onAddTag(plateNumber)}>
                      Add
                    </Button>
                  </Col>
                </Row>

                {tags.length > 0 && (
                  <Row style={{ marginBottom: 20, minHeight: 40 }}>
                    {tags
                      .filter(({ type }) => type === Number(DescriptorTypeEnum[tab]))
                      .map((tag, i) => (
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
                            <span>{tag.data}</span>
                            <span>
                              <X
                                size={16}
                                onClick={() => onFilterTags(tag)}
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

      <Button
        fullWidth
        type="primary"
        htmlType="submit"
        size="large"
        loading={isIdentityLoading || isDescriptorLoading || isDescriptorDeleteLoading}
      >
        Submit
      </Button>
    </Form>
  )

  return indetityForm
}

export default useIdentityForm
