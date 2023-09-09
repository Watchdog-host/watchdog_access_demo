import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Col, Form, Radio, Row, Steps, Button } from 'antd'

import { FormElements, Modal, NoData } from 'components'
import { useAddAccessPaymentMutation, useAddCheckinMutation, useAddDeviceDescriptorMutation, useLazyCheckinQuery } from 'store/endpoints'
import { IAccessDTO } from 'types'
import { DescriptorTypeEnum, PaymentTypeEnum } from 'constants/enums'
import { Car, Cash, ChevronLeft, CreditCard, DiscountCheck, ListDetails, Loader, Refresh, Scan } from 'tabler-icons-react'
import { svgVariables } from 'constants/common'
import './AddDescriptorModal.scss'
import RevenueCard from 'pages/Revenue/_components/RevenueCard'
import { logOut, toUpperCase } from 'utils'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setDescriptorModal } from 'store/slices/modals'
import { AnimatedSuccessIcon } from 'assets/icons'

enum StepsEnum {
  Descriptor = 0,
  Matches = 1,
  // Create = 2,
  Payment = 2,
  Done = 3,
}

const AddDescriptorModal: FC = () => {
  const {
    datas: { selecteData },
    modals: { descriptorModal },
    navigation: { currentEdge },
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const descriptor_type = (JSON.parse(selecteData?.extra_field)?.descriptor_type as DescriptorTypeEnum) ?? selecteData?.descriptor_type
  // const isBarcode = selecteData?.type == DeviceTypeEnum.BarcodeScanner
  const [descriptorValue, setDescriptorValue] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [step, setStep] = useState<StepsEnum>(StepsEnum.Descriptor)
  const lastSteps = useRef<StepsEnum[]>([])
  const focusRef = useRef<HTMLButtonElement>(null)
  const url = useRef('')
  const [timer, setTimer] = useState(5)

  const [checkin, lazyCheckinQuery] = useLazyCheckinQuery()
  const [addChechinMutation, { isLoading: isAddCheckinLoading }] = useAddCheckinMutation()
  const [addAccessPaymentMutation, { isLoading: isAccessPaymentLoading }] = useAddAccessPaymentMutation()
  const [addDeviceDescriptorMutation] = useAddDeviceDescriptorMutation()
  // const [selected, setSelected] = useState<any>('Unknown')
  // const [checkbox, setCheckbox] = useState<string>('')
  const [matchedItem, setMatchedItem] = useState<IAccessDTO>()
  // const { data: watchlistsData } = useWatchlistsQuery()

  // const WATCHLIST_OPTIONS = watchlistsData
  //   ?.filter(({ watchlists }) => watchlists?.length)
  //   ?.map(({ title, watchlists }) => {
  //     return {
  //       label: title,
  //       options: watchlists?.map(({ title, id }) => ({ title: title, value: id })),
  //     }
  //   }) as IGroupOptions[]

  const handleGenerateBarcode = () => {
    function generateNonRepeatingString(char = 10): string {
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = ''

      while (result.length < 10) {
        const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length))

        if (result.indexOf(randomCharacter) === -1) {
          result += randomCharacter
        }
      }

      return result
    }
    const str = generateNonRepeatingString()
    setDescriptorValue(str)
    form.setFieldsValue({
      descriptor: str,
    })
  }

  // const handleGenerateTitle = () => {
  //   const str = generateNonRepeatingString()
  //   setTitleValue(str)
  //   form.setFieldsValue({
  //     title: str,
  //   })
  // }
  // const selectedWatchlist = useMemo(() => watchlistsData?.map((item) => item.watchlists?.find((item) => item.title === selected))[0], [selected, watchlistsData])
  // const CHECKBOX_OPTIONS = useMemo(
  //   () =>
  //     selectedWatchlist?.extra_field &&
  //     JSON.parse(selectedWatchlist?.extra_field)
  //       ?.pricelist.split(':')
  //       .map((item: string) => {
  //         let label = `${item.split('-')[0]} m. : ${Number(item.split('-')[1]).toLocaleString('ru')}`
  //         return { label, value: item }
  //       }),
  //   [selectedWatchlist],
  // )

  // const isUnknown = selectedWatchlist?.title === 'Unknown'
  // const isUnknownItem = WATCHLIST_OPTIONS?.map(({ options }) => options.find(({ title }) => title === 'Unknown'))[0]

  // function onCheckboxChange(values: any) {
  //   const valuesNew = values.filter((v: any) => v !== checkbox)
  //   const value = valuesNew.length ? valuesNew[0] : ''
  //   setCheckbox(value)
  // }

  // async function onCheckin() {
  //   lastSteps.current.push(step)
  //     checkin({descriptor_type: descriptor_type ?? DescriptorTypeEnum.Barcode, descriptor: descriptorValue || selecteData?.descriptor,url: url.current || (currentEdge?.public_ip ?? '') })
  //     .then((res) => {
  //       if (res.isError) {
  //         if ((res.error as any)?.status == 'FETCH_ERROR') {
  //           toast.error('FETCH_ERROR')
  //           logOut()
  //         }
  //         toast.error((res.error as any).data.error)
  //         setStep(StepsEnum.Descriptor)
  //       }
  //       if (res.isSuccess) {
  //         const matched = res.data?.find((item) => item.confidence == 100)
  //         if (matched) {
  //           if (matched.debt) {
  //             setMatchedItem(matched)
  //             setStep(StepsEnum.Payment)
  //           } else {
  //             addDeviceDescriptorMutation({ ...matched, id: matched.device_id })
  //             setStep(StepsEnum.Done)
  //           }
  //         } else {
  //           setStep(StepsEnum.Matches)
  //         }
  //       }
  //     })
  // }

  async function onCheckin() {
    lastSteps.current.push(step)
    if (!currentEdge) return
    const handleCheckin = async (ip: string) => {
      const checkinParams = {
        descriptor_type: descriptor_type ?? DescriptorTypeEnum.Barcode,
        descriptor: descriptorValue || selecteData?.descriptor,
        url: ip,
      }

      try {
        const res = await checkin(checkinParams)
        if (res.isError) {
          if ((res.error as any)?.status === 'FETCH_ERROR') {
            toast.error('FETCH_ERROR')
            logOut()
          } else if ((res.error as any)?.message === 'Aborted') {
            url.current = currentEdge.public_ip
            await handleCheckin(currentEdge.public_ip)
          } else {
            toast.error((res.error as any).data?.error)
            setStep(StepsEnum.Descriptor)
          }
        } else if (res.isSuccess) {
          const matched = res.data?.find((item) => item.confidence === 100)
          if (matched) {
            if (matched.debt) {
              setMatchedItem(matched)
              setStep(StepsEnum.Payment)
            } else {
              addDeviceDescriptorMutation({ ...matched, id: selecteData?.device_id || selecteData?.id })
              setStep(StepsEnum.Done)
            }
          } else {
            setStep(StepsEnum.Matches)
          }
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
    }

    await handleCheckin(url.current || currentEdge.private_ip)
  }

  // async function onAddCheckin() {
  //   lastSteps.current.push(step)
  //   addChechinMutation({
  //     type: selecteData?.access_type || selecteData?.type,
  //     descriptor_type: descriptor_type ?? DescriptorTypeEnum.Barcode,
  //     descriptor: descriptorValue || selecteData?.descriptor,
  //   })
  //     .then((res: any) => {
  //       if (res.error) {
  //         if ((res.error as any).status == 'FETCH_ERROR') {
  //           toast.error('FETCH_ERROR')
  //           logOut()
  //         }
  //         toast.error((res.error as any).data || 'Something wrong')
  //         setStep(StepsEnum.Descriptor)
  //       } else {
  //         const matched = (res.data as IAccessDTO[]).find((item) => item.confidence == 100)
  //         if (matched) {
  //           if (matched.debt) {
  //             setMatchedItem(matched)
  //             setStep(StepsEnum.Payment)
  //           } else {
  //             setStep(StepsEnum.Done)
  //           }
  //         } else {
  //           setStep(StepsEnum.Matches)
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error((error as any).message)
  //       setStep(StepsEnum.Descriptor)
  //     })
  // }

  async function onAddCheckin() {
    lastSteps.current.push(step)

    if (!currentEdge) return

    const handleAddCheckin = async (ip: string) => {
      const mutationParams = {
        type: selecteData?.access_type || selecteData?.type,
        descriptor_type: descriptor_type ?? DescriptorTypeEnum.Barcode,
        descriptor: descriptorValue || selecteData?.descriptor,
        url: ip,
      }

      try {
        const res: any = await addChechinMutation(mutationParams)
        if (res.error) {
          if ((res.error as any)?.status === 'FETCH_ERROR') {
            toast.error('FETCH_ERROR')
            logOut()
          } else if ((res.error as any)?.message === 'Aborted') {
            url.current = currentEdge?.public_ip
            await handleAddCheckin(currentEdge.public_ip)
          } else {
            toast.error((res.error as any).data?.error)
            setStep(StepsEnum.Descriptor)
          }
        } else {
          const matched = (res.data as IAccessDTO[]).find((item) => item.confidence === 100)
          if (matched) {
            if (matched.debt) {
              setMatchedItem(matched)
              setStep(StepsEnum.Payment)
            } else {
              setStep(StepsEnum.Done)
            }
          } else {
            setStep(StepsEnum.Matches)
          }
        }
      } catch (error) {
        toast.error((error as any).message)
        setStep(StepsEnum.Descriptor)
      }
    }

    await handleAddCheckin(url.current || currentEdge?.private_ip)
  }

  // async function onPayment() {
  //   lastSteps.current.push(step)
  //   addAccessPaymentMutation({ id: matchedItem?.id, paid_amount: matchedItem?.debt, payment_type: paymentType, url: url.current || currentEdge?.private_ip })
  //     .then((res: any) => {
  //       if (res.error) {
  //         if ((res.error as any)?.status == 'FETCH_ERROR') {
  //           toast.error('FETCH_ERROR')
  //           logOut()
  //         }
  //         else if((res.error as any)?.message == 'Aborted'){
  //           url.current = currentEdge?.public_ip,
  //           addAccessPaymentMutation({ id: matchedItem?.id, paid_amount: matchedItem?.debt, payment_type: paymentType, url: currentEdge?.public_ip })
  //           .then((res: any) => {
  //             if (res.error) {
  //               if ((res.error as any)?.status == 'FETCH_ERROR') {
  //                 toast.error('FETCH_ERROR')
  //                 logOut()
  //               }
  //               toast.error((res.error as any).data || 'Something wrong')
  //               setStep(StepsEnum.Matches)
  //             } else {
  //               setStep(StepsEnum.Done)
  //               addDeviceDescriptorMutation({ ...matchedItem, id: matchedItem?.device_id })
  //             }
  //           })
  //         }
  //         toast.error((res.error as any).data || 'Something wrong')
  //         setStep(StepsEnum.Matches)
  //       } else {
  //         setStep(StepsEnum.Done)
  //         addDeviceDescriptorMutation({ ...matchedItem, id: matchedItem?.device_id })
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error((error as any).message)
  //       setStep(StepsEnum.Matches)
  //     })
  // }

  async function onPayment() {
    lastSteps.current.push(step)

    if (!currentEdge) return

    const handlePayment = async (ip: string) => {
      const paymentParams = {
        id: matchedItem?.id,
        paid_amount: matchedItem?.debt,
        payment_type: paymentType,
        url: ip,
      }

      try {
        const res: any = await addAccessPaymentMutation(paymentParams)

        if (res.error) {
          if ((res.error as any)?.status === 'FETCH_ERROR') {
            toast.error('FETCH_ERROR')
            logOut()
          } else if ((res.error as any)?.message === 'Aborted') {
            url.current = currentEdge?.public_ip
            await handlePayment(currentEdge.public_ip)
          } else {
            toast.error((res.error as any).data?.error)
            setStep(StepsEnum.Matches)
          }
        } else {
          setStep(StepsEnum.Done)
          addDeviceDescriptorMutation({ ...matchedItem, id: selecteData?.device_id || selecteData?.id })
        }
      } catch (error) {
        toast.error((error as any).message)
        setStep(StepsEnum.Matches)
      }
    }

    await handlePayment(url.current || currentEdge?.private_ip)
  }

  function onPrevious() {
    setStep((lastSteps.current.pop() as StepsEnum) || StepsEnum.Descriptor)
  }

  function onDone() {
    dispatch(setDescriptorModal(false))
  }

  function onSelectMatched(item: IAccessDTO) {
    lastSteps.current.push(step)
    if (item.debt) {
      setMatchedItem(item)
      setStep(StepsEnum.Payment)
    } else {
      setStep(StepsEnum.Done)
    }
  }

  useEffect(() => {
    if (selecteData?.descriptor) {
      onCheckin()
    }
  }, [selecteData])

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus()
    }
    let interval: string | number | NodeJS.Timer | undefined
    if (step == StepsEnum.Done) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev == 0) dispatch(setDescriptorModal(false))
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [step])

  const RADIO_OPTIONS = useMemo(
    () => [
      {
        label: (
          <div className="payment">
            <Cash size={70} color={svgVariables.$dark} />
            <div>Cash</div>
          </div>
        ),
        value: PaymentTypeEnum.Cash,
      },
      {
        label: (
          <div className="payment">
            <CreditCard size={70} color={svgVariables.$dark} />
            <div>Card</div>
          </div>
        ),
        value: PaymentTypeEnum.Card,
      },
    ],
    [],
  )

  const steps = [
    {
      id: 0,
      content: (
        <Form form={form} onFinish={onCheckin} layout="vertical">
          <Form.Item
            style={{ margin: '0 24px' }}
            name="descriptor"
            label={`*${DescriptorTypeEnum[descriptor_type]}:`}
            rules={[{ required: true, message: 'Descriptor is required' }]}
          >
            <div className="descriptor__inputBox">
              <FormElements.Input
                autoFocus
                onInput={descriptor_type == DescriptorTypeEnum.Plate ? toUpperCase : undefined}
                value={descriptorValue}
                className={'descriptor__input'}
                onChange={(e) => setDescriptorValue(e.target.value)}
                size="large"
                placeholder={`e.g., ${descriptor_type === DescriptorTypeEnum.Plate ? '01A123BC' : descriptor_type === DescriptorTypeEnum.Barcode ? '0123456789' : '...'}`}
              />
              {descriptor_type === DescriptorTypeEnum.Barcode && (
                <div onClick={handleGenerateBarcode} className="descriptor__generate">
                  <Refresh size={30} color={svgVariables.$dark} />
                </div>
              )}
            </div>
          </Form.Item>
          <div className="descriptor__btnBox">
            <Button
              ref={focusRef}
              disabled={!descriptorValue.length || lazyCheckinQuery.isLoading}
              type="primary"
              htmlType="submit"
              size="large"
              loading={lazyCheckinQuery.isFetching}
            >
              Next
            </Button>
          </div>
        </Form>
      ),
      icon: descriptor_type === DescriptorTypeEnum.Plate ? <Car /> : <Scan />,
    },
    {
      id: 1,
      content: (
        <>
          <div className="descriptor__accessBox">
            {!lazyCheckinQuery.isSuccess ? (
              <Loader />
            ) : lazyCheckinQuery.data?.length ? (
              <Row gutter={[12, 12]}>
                {lazyCheckinQuery.data?.map((data) => (
                  <Col className="fade item" style={{ padding: '0 24px' }} onClick={() => onSelectMatched(data)} span={24} key={data.id}>
                    <RevenueCard data={data} />
                  </Col>
                ))}
              </Row>
            ) : (
              <NoData />
            )}
          </div>
          <div className="descriptor__btnBox between">
            <Button onClick={onPrevious} className={'descriptor__btnBox__prev'} type="dashed" size="large">
              <ChevronLeft />
              <span>Previous</span>
            </Button>
            <Button type="primary" onClick={onAddCheckin} size="large" disabled={isAddCheckinLoading} loading={isAddCheckinLoading}>
              Create new
            </Button>
          </div>
        </>
      ),
      icon: <ListDetails />,
    },
    // {
    //   id: 2,
    //   content: (
    //     <>
    //       <Form.Item name="watchlist_id" label="Watchlist:">
    //         <FormElements.Select defaultValue={isUnknownItem?.value} groupOptions={WATCHLIST_OPTIONS} onChange={(_, item) => setSelected((item as DefaultOptionType).children)} />
    //       </Form.Item>
    //       {!isUnknown && (
    //         <>
    //           <Form.Item name="title" label="Title:" rules={[{ required: true, message: 'Title is required' }]}>
    //             <div className="descriptor__inputBox">
    //               <FormElements.Input value={titleValue} onChange={(e) => setTitleValue(e.target.value)} size="large" />
    //               <div onClick={handleGenerateTitle} className="descriptor__generate">
    //                 <Refresh size={30} color={svgVariables.$dark} />
    //               </div>
    //             </div>
    //           </Form.Item>
    //           <Form.Item name="type" label="Gender:">
    //             <FormElements.Select defaultValue={GENDER_SELECTS[0]} options={GENDER_SELECTS} />
    //           </Form.Item>
    //           <Form.Item name="birthdate" label="Birthdate:">
    //             <FormElements.DatePicker size="large" />
    //           </Form.Item>
    //         </>
    //       )}
    //       {CHECKBOX_OPTIONS?.length && (
    //         <Form.Item name={'pricelist'}>
    //           <Checkbox.Group className={'descriptor__checkbox'} options={CHECKBOX_OPTIONS} value={[checkbox]} onChange={onCheckboxChange} />
    //         </Form.Item>
    //       )}

    //       {checkbox && (
    //         <Form.Item name={'payment_type'} style={{ paddingBottom: 24 }} rules={[{ required: true, message: 'Payment type is required' }]}>
    //           <Radio.Group className={'descriptor__radio'} options={RADIO_OPTIONS} />
    //         </Form.Item>
    //       )}
    //     </>
    //   ),
    //   icon: <Checklist />,
    // },
    {
      id: 2,
      content: (
        <Form onFinish={onPayment} form={form} layout="vertical">
          <div className="descriptor__payment">
            <div className="descriptor__payment__debt">
              <p>
                {typeof matchedItem?.debt === 'number' ? matchedItem?.debt : 0}
                <span>UZS</span>
              </p>
            </div>
            <Form.Item name={'payment_type'} rules={[{ required: true, message: 'Payment type is required' }]}>
              <Radio.Group onChange={(e) => setPaymentType(e.target.value)} className={'descriptor__radio'} options={RADIO_OPTIONS} />
            </Form.Item>
          </div>
          <div className="descriptor__btnBox between">
            <Col span={6}>
              <Button className={'descriptor__btnBox__prev'} type="dashed" size="large" onClick={onPrevious}>
                <ChevronLeft />
                <span>Previous</span>
              </Button>
            </Col>
            <Col span={6}>
              <Button
                ref={focusRef}
                disabled={typeof paymentType !== 'number' || isAccessPaymentLoading}
                type="primary"
                htmlType="submit"
                size="large"
                loading={isAccessPaymentLoading}
              >
                Pay
              </Button>
            </Col>
          </div>
        </Form>
      ),
      icon: <Cash />,
    },
    {
      id: 3,
      content: (
        <Form form={form} onFinish={onDone}>
          <div className="descriptor__doneBtn">
            <AnimatedSuccessIcon size={80} />
            <p>Success</p>
          </div>
          <div className="descriptor__btnBox">
            <Button type="primary" htmlType="submit" size="large" ref={focusRef}>
              Done ({timer})
            </Button>
          </div>
        </Form>
      ),
      icon: <DiscountCheck />,
    },
  ]

  return (
    <Modal className="descriptor" open={descriptorModal} onOk={() => dispatch(setDescriptorModal(false))} onCancel={() => dispatch(setDescriptorModal(false))}>
      <Steps className="descriptor__stepsBox" responsive={false} current={step} items={steps.map((item) => ({ key: item.id, icon: item.icon }))} />
      {steps[step]?.content}
    </Modal>
  )
}

export default AddDescriptorModal
