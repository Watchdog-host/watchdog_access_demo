import {
  ACCESS_TYPE,
  ALERT_TYPE,
  DETECTOR_TYPE,
  DEVICE_TYPE,
  DIRECTION_TYPE,
  ENHANCEMENT_TYPE,
  GENDER_TYPE,
  ROLE_TYPE,
  STATE_NUMBERS,
  CAMERA_TYPE,
  PRINTER_TYPE,
  BARCODE_SCANNER_TYPE,
  LED_MATRIX_TYPE,
  TRIGGER_TYPE,
  RELAY_TYPE,
  DEVICE_MODEL_TYPE,
  DESCRIPTOR_TYPE,
  PLAN_TYPE,
  PLAN_LIST_TYPE,
  PLAN_BTN_TYPE,
} from 'types'
import { PlanTypeEnum, StatusTypeEnum } from './enums'

const isDev = process.env.NODE_ENV === 'development'
export const API_URL = isDev ? 'http://192.168.64.10/api/v1' : '/api/v1'
// export const API_URL = isDev ? 'http://192.168.24.184:8080/api/v1' : '/api/v1'

export const svgVariables = {
  $dark: '#141414',
  $lightGray: '#fbfbfb',
  $darkGray: '#aaa',
  $blue: '#5754ff',
  $white: '#fff',
  $red: '#ff4f37',
  $green: '#46bea3',
  $yellow: ' #FFCC00',

  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
}

// Selects
export const ROLE_SELECTS: { label: ROLE_TYPE; value: STATE_NUMBERS }[] = [
  { label: 'Owner', value: 0 },
  { label: 'Admin', value: 1 },
  { label: 'Agent', value: 2 },
  { label: 'Customer', value: 3 },
  { label: 'Operator', value: 4 },
  { label: 'Viewer', value: 5 },
]

export const GENDER_SELECTS: { label: GENDER_TYPE; value: STATE_NUMBERS }[] = [
  { label: 'Other', value: 0 },
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
]

export const ALERT_SELECTS: { label: ALERT_TYPE; value: STATE_NUMBERS }[] = [
  { label: 'None', value: 0 },
  { label: 'Information', value: 1 },
  { label: 'Warning', value: 2 },
  { label: 'Critical', value: 3 },
]

export const ACCESS_SELECTS: { label: ACCESS_TYPE; value: STATE_NUMBERS }[] = [
  { label: 'Undefined', value: 0 },
  { label: 'Allow', value: 1 },
  { label: 'Deny', value: 2 },
]

export const DIRECTION_SELECTS: {
  label: DIRECTION_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Undefined', value: 0 },
  { label: 'Registration', value: 1 },
  { label: 'Checkout', value: 2 },
]

export const ENHANCEMENT_SELECTS: {
  label: ENHANCEMENT_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'None', value: 0 },
  { label: 'BrightnessAndContrastAuto', value: 1 },
  { label: 'AINDANE', value: 2 },
  { label: 'WTHE', value: 3 },
  { label: 'AGCWD', value: 4 },
  { label: 'AGCIE', value: 5 },
  { label: 'IAGCWD', value: 6 },
  { label: 'CEusingLuminanceAdaptation', value: 7 },
  { label: 'AdaptiveImageEnhancement', value: 8 },
  { label: 'JHE', value: 9 },
  { label: 'SEF', value: 10 },
]

export const DETECTOR_SELECTS: {
  label: DETECTOR_TYPE
  value: DETECTOR_TYPE
}[] = [
  { label: 'lbpcpu', value: 'lbpcpu' },
  { label: 'lbpgpu', value: 'lbpgpu' },
  { label: 'lbpopencl', value: 'lbpopencl' },
  { label: 'morphcpu', value: 'morphcpu' },
]

export const DEVICE_SELECTS: { label: DEVICE_TYPE; value: STATE_NUMBERS }[] = [
  { label: 'Camera', value: 0 },
  { label: 'Printer', value: 1 },
  { label: 'BarcodeScanner', value: 2 },
  { label: 'LEDMatrix', value: 3 },
  { label: 'Trigger', value: 4 },
  { label: 'Relay', value: 5 },
]

export const CAMERA_TYPE_SELECTS: {
  label: CAMERA_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Generic', value: 0 },
  { label: 'Barcode', value: 1 },
  { label: 'Face', value: 2 },
  { label: 'Palm', value: 3 },
  { label: 'Plate', value: 4 },
  { label: 'Object', value: 5 },
]

export const PRINTER_TYPE_SELECTS: {
  label: PRINTER_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Generic', value: 0 },
  { label: 'Thermal', value: 1 },
]

export const BARCODE_SCANNER_TYPE_SELECTS: {
  label: BARCODE_SCANNER_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Generic', value: 0 },
  { label: 'CDC', value: 1 },
]

export const LED_MATRIX_TYPE_SELECTS: {
  label: LED_MATRIX_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Generic', value: 0 },
  { label: 'LED', value: 1 },
]

export const TRIGGER_TYPE_SELECTS: {
  label: TRIGGER_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Generic', value: 0 },
  { label: 'Button', value: 1 },
]

export const RELAY_TYPE_SELECTS: {
  label: RELAY_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Generic', value: 0 },
  { label: 'Barrier', value: 1 },
]

// Device model selects
export const DEVICE_MODEL_SELECTS: {
  label: DEVICE_MODEL_TYPE
  value: STATE_NUMBERS
}[] = [{ label: 'Router', value: 0 }]

export const CAMERA_MODEL_SELECTS: {
  label: DEVICE_MODEL_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Router', value: 0 },
  { label: 'OpenCV', value: 1 },
]
export const DESCRIPTOR_TYPE_SELECT: {
  label: DESCRIPTOR_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Barcode', value: 0 },
  { label: 'Face', value: 1 },
  { label: 'Plate', value: 2 },
]

export const PLAN_TYPE_SELECT: {
  label: PLAN_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Basic', value: 0 },
  { label: 'Pro', value: 1 },
  { label: 'Business', value: 2 },
  { label: 'Enterprise', value: 3 },
]

// Steps by Record
export const ROLE_STEPS: Record<number, ROLE_TYPE> = {
  0: 'Owner',
  1: 'Admin',
  2: 'Agent',
  3: 'Customer',
  4: 'Operator',
  5: 'Viewer',
}
export const VERSIONS = {
  PANEL: '0.1.0',
  GATEWAY_API: '0.1.0',
}
export const PLAN_LIST: PLAN_LIST_TYPE = {
  [PlanTypeEnum.Basic]: ['sometext', 'sometext', 'sometext'],
  [PlanTypeEnum.Pro]: ['sometext', 'sometext', 'sometext'],
  [PlanTypeEnum.Business]: ['sometext', 'sometext', 'sometext'],
  [PlanTypeEnum.Enterprise]: ['sometext', 'sometext', 'sometext'],
}

export const PLAN_BTN_COLOR: PLAN_BTN_TYPE = {
  [PlanTypeEnum.Basic]: 'white',
  [PlanTypeEnum.Pro]: '#5654FF',
  [PlanTypeEnum.Business]: '#46bea3',
  [PlanTypeEnum.Enterprise]: '#141414',
}

export const DEVICE_STATUS_INDICATOR = {
  '0': 'processing',
  '1': 'warning',
  '2': 'error',
}
export const statusMapping = {
  [StatusTypeEnum.Online]: 'online',
  [StatusTypeEnum.Degraded]: 'degraded',
  [StatusTypeEnum.Offline]: 'offline',
}
