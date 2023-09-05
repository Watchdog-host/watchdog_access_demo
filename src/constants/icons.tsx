import {
  AlertOctagon,
  AlertTriangle,
  BuildingBank,
  Car,
  Cash,
  CircleCheck,
  CircleX,
  CreditCard,
  DeviceTv,
  DoorEnter,
  DoorExit,
  DoorOff,
  FaceId,
  InfoCircle,
  Printer,
  Qrcode,
  Scan,
  SwitchHorizontal,
  Target,
  Video,
} from 'tabler-icons-react'
import { svgVariables } from './common'
import { isCurrentPath } from 'utils'
export const AlertTypeIcons = {
  '0': <></>,
  '1': <InfoCircle size={20} color={svgVariables.$blue} />,
  '2': <AlertTriangle size={20} color={svgVariables.$yellow} />,
  '3': <AlertOctagon size={20} color={svgVariables.$red} />,
}
export const AccessTypeIcons = {
  '0': <DoorOff size={20} color={svgVariables.$darkGray} />,
  '1': <DoorEnter size={20} color={svgVariables.$darkGray} />,
  '2': <DoorExit size={20} color={svgVariables.$darkGray} />,
}
export const VerifyTypeIcons = {
  '0': <CircleX size={20} color={svgVariables.$darkGray} />,
  '1': <CircleCheck size={20} color={svgVariables.$green} />,
}
export const DeviceTypeIcons = {
  '0': <Video size={20} color={svgVariables.$dark} />,
  '1': <Printer size={20} color={svgVariables.$dark} />,
  '2': <Scan size={20} color={svgVariables.$dark} />,
  '3': <DeviceTv size={20} color={svgVariables.$dark} />,
  '4': <Target size={20} color={svgVariables.$dark} />,
  '5': <SwitchHorizontal size={20} color={svgVariables.$dark} />,
}
export const DescriptorTypeIcons = {
  '0': <Qrcode size={20} color={svgVariables.$dark} />,
  '1': <FaceId size={20} color={svgVariables.$dark} />,
  '2': <Car size={20} color={svgVariables.$dark} />,
}

export const PaymentTypeIcons = {
  '0': <Cash size={20} color={svgVariables.$dark} />,
  '1': <CreditCard size={20} color={svgVariables.$dark} />,
  '2': <BuildingBank size={20} color={svgVariables.$dark} />,
}
