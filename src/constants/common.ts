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
  PAYMENT_TYPE,
  PLAN_TYPE,
  PLAN_LIST_TYPE,
  PLAN_BTN_TYPE,
  BARCODE_FORMATS_TYPE,
  BARCODE_BINARIZER_TYPE,
  GRANT_TYPE,
  EDGE_TYPE,
} from 'types'
import { PlanTypeEnum, StatusTypeEnum } from './enums'
import pkgJSON from '../../package.json'
export const VERSIONS = {
  ACCESS_WEB: pkgJSON.version,
}
const isDev = process.env.NODE_ENV === 'development'

const BASE_URL = isDev ? 'http://123.456.78.9:8080/api' : `${window.location.origin}/api`

export { BASE_URL }

export const svgVariables = {
  $dark: '#141414',
  $darkGray: '#aaa',
  $gray: '#fafafa',
  $blue: '#5754ff',
  $white: '#fff',
  $red: '#ff4f37',
  $green: '#46bea3',
  $yellow: '#FFCC00',

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
  { label: 'Male', value: 0 },
  { label: 'Female', value: 1 },
]

export const ALERT_SELECTS: { label: ALERT_TYPE; value: STATE_NUMBERS }[] = [
  { label: 'Information', value: 0 },
  { label: 'Warning', value: 1 },
  { label: 'Critical', value: 2 },
]

export const GRANT_SELECTS: { label: GRANT_TYPE; value: STATE_NUMBERS }[] = [
  { label: 'Allow', value: 0 },
  { label: 'Deny', value: 1 },
]

export const ACCESS_TYPE_SELECTS: {
  label: ACCESS_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'CheckIn', value: 0 },
  { label: 'CheckOut', value: 1 },
]

export const ENHANCEMENT_SELECTS: {
  label: ENHANCEMENT_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'BrightnessAndContrastAuto', value: 0 },
  { label: 'AINDANE', value: 1 },
  { label: 'WTHE', value: 2 },
  { label: 'AGCWD', value: 3 },
  { label: 'AGCIE', value: 4 },
  { label: 'IAGCWD', value: 5 },
  { label: 'CEusingLuminanceAdaptation', value: 6 },
  { label: 'AdaptiveImageEnhancement', value: 7 },
  { label: 'JHE', value: 8 },
  { label: 'SEF', value: 9 },
]

export const BARCODE_FORMATS_SELECTS: {
  label: BARCODE_FORMATS_TYPE
  value: BARCODE_FORMATS_TYPE
}[] = [
  { label: 'Aztec', value: 'Aztec' },
  { label: 'Codabar', value: 'Codabar' },
  { label: 'Code39', value: 'Code39' },
  { label: 'Code93', value: 'Code93' },
  { label: 'Code128', value: 'Code128' },
  { label: 'DataBar', value: 'DataBar' },
  { label: 'DataBarExpanded', value: 'DataBarExpanded' },
  { label: 'DataMatrix', value: 'DataMatrix' },
  { label: 'EAN8', value: 'EAN8' },
  { label: 'EAN13', value: 'EAN13' },
  { label: 'ITF', value: 'ITF' },
  { label: 'MaxiCode', value: 'MaxiCode' },
  { label: 'PDF417', value: 'PDF417' },
  { label: 'QRCode', value: 'QRCode' },
  { label: 'UPCA', value: 'UPCA' },
  { label: 'UPCE', value: 'UPCE' },
  { label: 'MicroQRCode', value: 'MicroQRCode' },
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
export const EDGE_TYPE_SELECTS: {
  label: EDGE_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Virtual', value: 0 },
  { label: 'Physical', value: 1 },
]

export const CAMERA_MODEL_SELECTS: {
  label: DEVICE_MODEL_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Gateway', value: 0 },
  { label: 'OpenCV', value: 1 },
]

export const DEVICES_MODEL_SELECTS: {
  label: DEVICE_MODEL_TYPE
  value: STATE_NUMBERS
}[] = [{ label: 'Gateway', value: 0 }]

export const PRINTER_MODEL_SELECTS: {
  label: DEVICE_MODEL_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Gateway', value: 0 },
  { label: 'CUPS', value: 1 },
]

export const BARCODE_BINARIZER: {
  label: BARCODE_BINARIZER_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Local avarage', value: 0 },
  { label: 'Global histogram', value: 1 },
  { label: 'Fixed threshold', value: 2 },
  { label: 'Bool cast', value: 3 },
]

export const DESCRIPTOR_TYPE_SELECT: {
  label: DESCRIPTOR_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Barcode', value: 0 },
  { label: 'Face', value: 1 },
  { label: 'Plate', value: 2 },
]
export const PAYMENT_TYPE_SELECT: {
  label: PAYMENT_TYPE
  value: STATE_NUMBERS
}[] = [
  { label: 'Cash', value: 0 },
  { label: 'Card', value: 1 },
  { label: 'Bank', value: 2 },
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
