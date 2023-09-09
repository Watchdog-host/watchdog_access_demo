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
  Information = 0,
  Warning = 1,
  Critical = 2,
}
export enum GrantTypeEnum {
  Allow = 0,
  Deny = 1,
}

export enum AccessTypeEnum {
  CheckIn = 0,
  CheckOut = 1,
}

export enum StatusTypeEnum {
  Online = 0,
  Degraded = 1,
  Offline = 2,
}
export enum EdgeStatusEnum {
  Online = 0,
  Degraded = 1,
}
export enum DeviceModelEnum {
  Gateway = 0,
  OpenCV = 1,
}

export enum BarcodeBinarizerEnum {
  LocalAvarage = 0,
  GlobalHistogram = 1,
  FixedThreshold = 2,
  BoolCast = 3,
}

export enum PrinterTypeEnum {
  Gateway = 0,
  CUPS = 1,
}

export enum GenderTypeEnum {
  Male = 0,
  Female = 1,
}

export enum EdgeTypeEnum {
  Virtual = 0,
  Physical = 1,
}

export enum WatchlistTypeEnum {
  Timely = 0,
}

export enum ViewTypeEnum {
  Access = 0,
  Map = 1,
}
