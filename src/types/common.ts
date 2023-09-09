import { PlanTypeEnum } from 'constants/enums'

export type Nullable<Type = any> = {
  [Key in keyof Type]: Type[Key] | null
}

export type STATE_NUMBERS = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
export type durationType = '1' | '12'

export type ROLE_TYPE = 'Owner' | 'Admin' | 'Agent' | 'Customer' | 'Operator' | 'Viewer'
export type GENDER_TYPE = 'Other' | 'Male' | 'Female'
export type VIEW_TYPE = 'Access' | 'Map'

export type SIDEBAR_LINK_TYPE =
  | 'Access'
  | 'Map'
  | 'Camera'
  | 'Printer'
  | 'BarcodeScanner'
  | 'LEDMatrix'
  | 'Trigger'
  | 'Relay'
  | 'Alerts'
  | 'Revenue'
  | 'Attendance'
  | 'Plans'
  | 'Payments'

export type ALERT_TYPE = 'Information' | 'Warning' | 'Critical'
export type GRANT_TYPE = 'Allow' | 'Deny'
export type EDGE_TYPE = 'Virtual' | 'Physical'
export type ACCESS_TYPE = 'CheckIn' | 'CheckOut'
export type DIRECTION_TYPE = 'Undefined' | 'Registration' | 'Checkout'
export type ENHANCEMENT_TYPE =
  | 'None'
  | 'BrightnessAndContrastAuto'
  | 'AINDANE'
  | 'WTHE'
  | 'AGCWD'
  | 'AGCIE'
  | 'IAGCWD'
  | 'CEusingLuminanceAdaptation'
  | 'AdaptiveImageEnhancement'
  | 'JHE'
  | 'SEF'
export type BARCODE_FORMATS_TYPE =
  | 'All'
  | 'Aztec'
  | 'Codabar'
  | 'Code39'
  | 'Code93'
  | 'Code128'
  | 'DataBar'
  | 'DataBarExpanded'
  | 'DataMatrix'
  | 'EAN8'
  | 'EAN13'
  | 'ITF'
  | 'MaxiCode'
  | 'PDF417'
  | 'QRCode'
  | 'UPCA'
  | 'UPCE'
  | 'MicroQRCode'

export type BARCODE_BINARIZER_TYPE = 'Local avarage' | 'Global histogram' | 'Fixed threshold' | 'Bool cast'
export type DETECTOR_TYPE = 'lbpcpu' | 'lbpgpu' | 'lbpopencl' | 'morphcpu'

// Devices types
export type DEVICE_TYPE = 'Camera' | 'Printer' | 'BarcodeScanner' | 'LEDMatrix' | 'Trigger' | 'Relay'

export type CAMERA_TYPE = 'Generic' | 'Barcode' | 'Face' | 'Palm' | 'Plate' | 'Object'
export type PRINTER_TYPE = 'Generic' | 'Thermal'
export type BARCODE_SCANNER_TYPE = 'Generic' | 'CDC'
export type LED_MATRIX_TYPE = 'Generic' | 'LED'
export type TRIGGER_TYPE = 'Generic' | 'Button'
export type RELAY_TYPE = 'Generic' | 'Barrier'

export type DESCRIPTOR_TYPE = 'Barcode' | 'Face' | 'Plate'
export type PAYMENT_TYPE = 'Cash' | 'Card' | 'Bank'
export type DEVICE_STATUS_TYPE = 'online' | 'offline' | 'degraded'

export type DEVICE_MODEL_TYPE = 'Gateway' | 'OpenCV' | 'Router' | 'CUPS'
export type PLAN_TYPE = 'Basic' | 'Pro' | 'Business' | 'Enterprise'

export type DEVICE_BADGE_TYPE = 'processing' | 'warning' | 'error' | 'default' | 'success' | undefined

export type SELECT_OPTION_TYPES = {
  key?: number | string
  title?: string | number
  value?: string | number
}

export type PLAN_LIST_TYPE = {
  [key in PlanTypeEnum]: string[]
}
export type PLAN_BTN_TYPE = {
  [key in PlanTypeEnum]: string
}

type FILTER_OPERATORS = '=' | '<' | '>' | '<=' | '>=' | '!=' | 'in'

export type FILTER_ACTIONS_TYPE = [string, FILTER_OPERATORS, any][]

export type LAYOUT_TYPE = 'map' | 'notification'
