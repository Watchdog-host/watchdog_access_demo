import {
  Barcode,
  BarcodeOff,
  CameraOff,
  DeviceTv,
  DeviceTvOff,
  Printer,
  PrinterOff,
  Target,
  TargetOff,
  CircuitSwitchOpen,
  CircuitSwitchClosed,
  CircuitBulb,
} from 'tabler-icons-react'
import { svgVariables } from './common'

export const device_states = {
  Camera: {
    online: {
      icon: 'camera',
    },
    degraded: {
      icon: (
        <CameraOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <CameraOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
  },
  Printer: {
    online: {
      icon: (
        <Printer
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    degraded: {
      icon: (
        <PrinterOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <PrinterOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
  },
  BarcodeScanner: {
    online: {
      icon: (
        <Barcode
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    degraded: {
      icon: (
        <BarcodeOff
          className="deviceOffline"
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <BarcodeOff
          className="deviceOffline"
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
  },
  LEDMatrix: {
    online: {
      icon: (
        <DeviceTv
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    degraded: {
      icon: (
        <DeviceTvOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <DeviceTvOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
  },
  Trigger: {
    online: {
      icon: (
        <Target
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    degraded: {
      icon: (
        <TargetOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <TargetOff
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
  },
  Relay: {
    online: {
      icon: (
        <CircuitSwitchOpen
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    degraded: {
      icon: (
        <CircuitSwitchClosed
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <CircuitBulb
          color={svgVariables.$darkGray}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
  },
}
