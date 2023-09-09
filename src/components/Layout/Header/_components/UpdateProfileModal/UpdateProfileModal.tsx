import { FC, useEffect, useState } from 'react'
import { Alert, Form, Upload, Modal as AntModal } from 'antd'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from 'store/hooks'
import { Button, FormElements, Modal, Tabs } from 'components'
import { useAccountByIdQuery, useAccountsQuery, useUpdateProfileMutation } from 'store/endpoints'
import { ROLE_STEPS } from 'constants/common'
import { logOut } from 'utils'
import { useLocalStorage } from 'react-use'
import { IProfileDTO } from 'types'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { Plus } from 'tabler-icons-react'
import ImgCrop from 'antd-img-crop'
import classes from './UpdateProfileModal.module.scss'

export type Props = {
  visible: boolean
  setVisible: (bool: boolean) => void
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const UpdateProfileModal: FC<Props> = ({ visible, setVisible }) => {
  const [form] = Form.useForm()
  const [password, setPassword] = useState<string>()
  const navigate = useNavigate()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [error, setError] = useState(false)

  const { currentEdge } = useAppSelector((state) => state.navigation)
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')

  const [updateProfileMutation, { isLoading }] = useUpdateProfileMutation()

  useEffect(() => {
    form.setFieldsValue({
      title: localProfile?.title,
      email: localProfile?.email,
      type: ROLE_STEPS[localProfile?.type as number],
    })
  }, [localProfile, form, visible])

  const onFinish = (values: any) => {
    const formData = {
      ...values,
      image: fileList[0]?.thumbUrl,
      edge_id: currentEdge?.id,
      id: localProfile?.id,
    }

    const mutationPromise = updateProfileMutation({
      profile_id: localProfile?.id,
      ...formData,
    }).unwrap()
    toast
      .promise(mutationPromise, {
        loading: `updating profile...`,
        success: `successfully updated`,
        error: (error) => {
          if (error?.status == 'FETCH_ERROR') {
            logOut()
            return error?.error
          }
          return error?.data?.error
        },
      })
      .then(() => {
        setVisible?.(false)
        setFileList([])
        localStorage.removeItem('profile')
        navigate('/login')
      })
  }

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  })

  const handleCancel = () => setPreviewOpen(false)

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt3M = file.size / 1024 / 1024 < 2

    if (!isJpgOrPng || !isLt3M) {
      setError(true)
      if (!isJpgOrPng) {
        toast.error('You can only upload JPG / PNG files!')
      } else {
        toast.error('Image must be smaller than 2MB!')
      }
      return false
    } else {
      setError(false)
      return true
    }
  }
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (!error) {
      setFileList(newFileList)
    }
  }

  const uploadButton = (
    <div>
      <Plus />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  function handleModalClose() {
    setVisible(false)
    setPreviewOpen(false)
    setFileList([])
  }

  return (
    <Modal title="Update Profile" open={visible} onOk={handleModalClose} onCancel={handleModalClose}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Alert message="After your profile is updated, you will be logged out" type="warning" showIcon closable />
        <Tabs
          items={[
            {
              key: '1',
              label: 'General',
              children: (
                <>
                  <Form.Item name="avatar" className={classes.avatarBox} label="Avatar:">
                    <div className={classes.avatarBox}>
                      {!fileList.length && (fileList[0]?.thumbUrl || localProfile?.image) && (
                        <img className={classes.avatar} src={fileList[0]?.thumbUrl || localProfile?.image} alt="avatar" style={{ width: '100%' }} />
                      )}
                      <ImgCrop maxZoom={6} cropShape={'round'} quality={0.2} showReset rotationSlider>
                        <Upload
                          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          listType="picture-card"
                          maxCount={1}
                          name="avatar"
                          className="avatar-uploader"
                          beforeUpload={beforeUpload}
                          onPreview={handlePreview}
                          onChange={handleChange}
                        >
                          {uploadButton}
                        </Upload>
                      </ImgCrop>
                    </div>
                    <AntModal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </AntModal>
                  </Form.Item>
                  <Form.Item name="title" label="Full name:" rules={[{ required: true, message: 'full name is required' }]}>
                    <FormElements.Input size="large" />
                  </Form.Item>
                  <Form.Item name="email" label="Email:" rules={[{ required: true, message: 'email is required' }]}>
                    <FormElements.Input size="large" />
                  </Form.Item>
                  <Form.Item name="type" label="Role:">
                    <FormElements.Input size="large" disabled />
                  </Form.Item>
                </>
              ),
            },
            {
              key: '2',
              label: 'Change password',
              children: (
                <>
                  <Form.Item
                    name="old_password"
                    label="Old password:"
                    rules={[
                      {
                        required: !!password?.length,
                        message: 'old password is required',
                      },
                    ]}
                  >
                    <FormElements.Input size="large" isPassword />
                  </Form.Item>

                  <Form.Item name="password" label="New password:">
                    <FormElements.Input size="large" isPassword onChange={(e) => setPassword(e.target.value)} />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />

        <Button fullWidth type="primary" htmlType="submit" size="large" loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default UpdateProfileModal
