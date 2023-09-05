import React, { FC, ReactNode } from 'react'
import { Col, Form, Row, FormItemProps } from 'antd'
import Button from 'components/Button'
import { CircleMinus, Plus } from 'tabler-icons-react'

type Props = {
  name: string
  label: string
  keyName: string
  buttonName: string
  initialValue?: any
  withoutMinus?: boolean
  withoutAdd?: boolean
  formProps?: FormItemProps
  children?: ReactNode
}

const FieldGenerator: FC<Props> = ({
  name,
  label,
  keyName,
  buttonName,
  initialValue,
  withoutMinus,
  withoutAdd,
  formProps,
  children,
}) => {
  return (
    <>
      <Form.List name={name} initialValue={initialValue}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} align="middle" gutter={10}>
                <Col span={23}>
                  <Form.Item {...restField} label={label} name={[name, keyName]} {...formProps}>
                    {children}
                  </Form.Item>
                </Col>
                <Col span={1}>{!withoutMinus && <CircleMinus onClick={() => remove(name)} />}</Col>
              </Row>
            ))}
            <Form.Item>
              <Row justify="center">
                <Button
                  fullWidth
                  type="ghost"
                  size="large"
                  icon={<Plus />}
                  onClick={() => add()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {buttonName}
                </Button>
              </Row>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  )
}

export default FieldGenerator
