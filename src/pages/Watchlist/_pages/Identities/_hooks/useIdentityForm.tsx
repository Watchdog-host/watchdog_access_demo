import { useEffect, useState } from 'react'
import { Col, Form, Grid, Row, Tag } from 'antd'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Button, FormElements, Tabs } from 'components'
import _ from 'lodash'
import { X } from 'tabler-icons-react'
import { useAddIdentityMutation, useLazyIdentityByIdQuery, useUpdateIdentityMutation } from 'store/endpoints'
import { GENDER_SELECTS } from 'constants/common'
import { useGetRole } from 'hooks'
import { DescriptorTagType, IIdentityDTO } from 'types'
import { DescriptorTypeEnum, GenderTypeEnum } from 'constants/enums'
import dayjs from 'dayjs'
import { createDescriptorObject, fromDescriptorObject } from 'utils/data'
import { logOut, toUpperCase } from 'utils'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setSelectedData } from 'store/slices/data'
export type Props = {
  data?: IIdentityDTO
  type?: 'PUT' | 'POST'
  visible?: boolean
  setVisible?: (bool: boolean) => void
}

const useIdentityForm = ({ type, data, visible, setVisible }: Props = {}) => {
  const [form] = Form.useForm()
  const { useBreakpoint } = Grid
  const { xs } = useBreakpoint()
  const [plateNumber, setPlateNumber] = useState<string>('')
  const [barcodeNumber, setBarcodeNumber] = useState<string>('')
  const [tab, setTab] = useState<any>('')
  const [tags, setTags] = useState<DescriptorTagType[]>([])
  const { id: watchlist_id } = useParams()
  const { isOwner, isAdmin, isAgent } = useGetRole()
  // const { selecteData } = useAppSelector(store => store.datas)
  // const dispatch = useAppDispatch()

  const [addAddIdentityMutation, { isLoading: isIdentityLoading }] = useAddIdentityMutation()
  // const [getLazyIdentityById, { data: lazeIdentityData }] = useLazyIdentityByIdQuery()
  const [updateIdentityMutation, { isLoading: isIdentityUpdateLoading }] = useUpdateIdentityMutation()

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setPlateNumber('')
      setBarcodeNumber('')
    }
    if (
      data
      // || lazeIdentityData
    ) {
      form.setFieldsValue({
        title: data?.title,
        // || lazeIdentityData?.title,
        type: data?.type,
        //  || lazeIdentityData?.type,
        birthdate: dayjs(
          data?.birthdate || dayjs(),
          // || lazeIdentityData?.birthdate
        ),
      })
      if (data?.extra_field) {
        setTags(
          fromDescriptorObject(
            JSON.parse(
              data?.extra_field,
              // || lazeIdentityData?.extra_field
            ),
          ),
        )
      }
    }
    // if (selecteData) {
    //   setTags(prev => ([{ ...prev, type: selecteData.descriptor_type, descriptor: selecteData.descriptor }]))
    // }
  }, [
    form,
    data,
    visible,
    // lazeIdentityData, selecteData
  ])

  // useEffect(() => {
  //   if (selecteData?.identity_id) {
  //     getLazyIdentityById({ id: selecteData.identity_id })
  //   }
  //     // return () => {
  //     //   dispatch(setSelectedData(undefined))
  //     // }
  // }, [visible, lazeIdentityData])

  // console.log(selecteData);

  const onFinish = (values: any) => {
    const extra_field = JSON.stringify(createDescriptorObject(tags))
    const formData = {
      id: data?.id,
      title: values.title,
      type: values.type ?? null,
      birthdate: values.birthdate,
      watchlist_id: Number(watchlist_id),
      // || selecteData?.watchlist_id,
      extra_field: extra_field,
    }

    if (isOwner || isAdmin || isAgent) {
      if (
        data &&
        // || lazeIdentityData
        type === 'PUT'
      ) {
        const mutationPromises = updateIdentityMutation({
          identity_id: data?.id,
          ...formData,
        }).unwrap()
        toast
          .promise(mutationPromises, {
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
      }
      if (type === 'POST') {
        const mutationPromises = addAddIdentityMutation(formData).unwrap()
        toast
          .promise(mutationPromises, {
            loading: `adding identity...`,
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
          })
      }
    } else {
      toast.error('Permission denied!')
    }
  }

  const onAddTag = (number: string) => {
    if (number.trim().length) {
      setTags((prev) => [...prev, { descriptor: number.trim(), type: Number(DescriptorTypeEnum[tab]) }])
      form.resetFields(['barcode', 'license_plate'])
      setPlateNumber('')
      setBarcodeNumber('')
    }
  }
  const onFilterTags = (tag: DescriptorTagType) => {
    setTags(() => tags?.filter((item) => item.descriptor !== tag.descriptor))
  }

  const indetityForm = (
    <Form
      onFinish={onFinish}
      form={form}
      layout="vertical"
      initialValues={
        {
          // type: GENDER_SELECTS[GenderTypeEnum.Other].value
        }
      }
    >
      <Tabs
        onTabClick={(tab, e) => setTab(_.upperFirst((e.target as HTMLDivElement).innerText.split(' ')[1] || (e.target as HTMLDivElement).innerText))}
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
                  <FormElements.Select allowClear options={GENDER_SELECTS} />
                </Form.Item>

                <Form.Item name="birthdate" label="Birthdate:">
                  <FormElements.DatePicker size="large" />
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
                  <Col span={xs ? 18 : 20}>
                    <Form.Item name="barcode" label="Barcode:">
                      <FormElements.Input size="large" placeholder="e.g., 0123456789 | ABCDEFG" value={barcodeNumber} onChange={(e) => setBarcodeNumber(e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col style={{ marginTop: xs ? 10 : '' }} span={xs ? 6 : 4}>
                    <Button size="large" type="primary" fullWidth onClick={() => onAddTag(barcodeNumber)}>
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
                            <span>{tag.descriptor}</span>
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
                    <Form.Item name="license_plate" label="License plate:">
                      <FormElements.Input onInput={toUpperCase} size="large" placeholder="e.g., 01A234BC" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button size="large" type="primary" fullWidth onClick={() => onAddTag(plateNumber)}>
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
                            <span>{tag.descriptor}</span>
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

      <Button fullWidth type="primary" htmlType="submit" size="large" loading={isIdentityLoading || isIdentityUpdateLoading}>
        Submit
      </Button>
    </Form>
  )

  return indetityForm
}

export default useIdentityForm
