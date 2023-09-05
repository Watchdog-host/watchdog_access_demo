import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Col, Form, Row, Checkbox } from 'antd'

import { Button, FormElements } from 'components'
import { useLoginMutation, useProfileQuery } from 'store/endpoints'
import logo from 'assets/icons/logo-icon.png'

import classes from './Login.module.scss'

type Props = {}

const Login: FC<Props> = () => {
  const [form] = Form.useForm()
  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation()
  const navigate = useNavigate()

  const { refetch } = useProfileQuery()

  const onFinishLogin = (values: any) => {
    const loginValues = {
      email: values.email,
      password: values.password,
    }

    const mutationPromise = loginMutation(loginValues).unwrap()

    toast
      .promise(mutationPromise, {
        loading: `Logging in...`,
        success: `Successfully logged in`,
        error: ({ data }) => data?.error,
      })
      .then((res) => {
        localStorage.setItem('token', res.token)
        navigate('/')
        refetch()
      })
  }

  return (
    <div className={`fade ${classes.container}`}>
      <Row className={classes.header} align="middle">
        <Link to="/">
          <Row align={'middle'} gutter={15}>
            <Col>
              <img src={logo} alt="Watchdog Access™" height={56} />
            </Col>
            <Col>
              <Row>
                <Col span={24} className={classes.logoText}>
                  watchdog
                </Col>
                <Col span={24} className={classes.logoSubtext}>
                  <b>access™</b>
                </Col>
              </Row>
            </Col>
          </Row>
        </Link>
      </Row>
      <Row className={classes.login} align="middle" justify="center">
        <Col className={classes.loginMain}>
          <h1>Welcome back!</h1>
          <br />
          <Form form={form} name="basic" layout="vertical" className={classes.form} onFinish={onFinishLogin}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <FormElements.Input size="large" />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <FormElements.Input isPassword />
            </Form.Item>

            {/* <Row justify="space-between" className={classes.formFooter}>
              <Col>
                <Form.Item>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Col>
              <Col className={classes.formFooterPassword}>
                <Link to="/">Forgot password</Link>
              </Col>
            </Row> */}

            <Form.Item>
              <Button type="primary" htmlType="submit" fullWidth size="large" loading={loginLoading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <div className={classes.footer}>
        This site is protected by reCAPTCHA and the Google&nbsp;
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
          Privacs Policy&nbsp;
        </a>
        and&nbsp;
        <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
          Terms of Service&nbsp;
        </a>
        apply.
      </div>
      <div className={classes.footerLogo}></div>
    </div>
  )
}

export default Login
