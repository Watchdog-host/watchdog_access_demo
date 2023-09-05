export enum AccountTypeEnum {
  Owner = 0,
  Admin = 1,
  Agent = 2,
  Customer = 3,
  Operator = 4,
  Viewer = 5,
}

export enum DescriptorTypeEnum {
  Barcode = 0,
  Face = 1,
  Plate = 2,
}

export enum DeviceTypeEnum {
  Camera = 0,
  Printer = 1,
  BarcodeScanner = 2,
  LEDMatrix = 3,
  Trigger = 4,
  Relay = 5,
}
export enum PlanTypeEnum {
  Basic = 0,
  Pro = 1,
  Business = 2,
  Enterprise = 3,
}

export enum PaymentTypeEnum {
  Cash = 0,
  Card = 1,
  Bank = 2,
}

export enum AlertTypeEnum {
  None = 0,
  Information = 1,
  Warning = 2,
  Critical = 3,
}
export enum GrantTypeEnum {
  Undefined = 0,
  Allow = 1,
  Deny = 2,
}

export enum AccessTypeEnum {
  Undefined = 0,
  Registration = 1,
  Checkout = 2,
}

export enum StatusTypeEnum {
  Online = 0,
  Degraded = 1,
  Offline = 2,
}
