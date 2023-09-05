import { AlertTriangle, CameraOff, PrinterOff, Scan, ScreenShareOff } from 'tabler-icons-react'
import { svgVariables } from './common'

export const device_states = {
  Camera: {
    online: {
      icon: 'camera',
    },
    degraded: {
      icon: (
        <AlertTriangle
          color={svgVariables.$yellow}
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
      icon: 'printer',
    },
    degraded: {
      icon: (
        <AlertTriangle
          color={svgVariables.$yellow}
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
      icon: 'scanner',
    },
    degraded: {
      icon: (
        <AlertTriangle
          color={svgVariables.$yellow}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <Scan
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
      icon: 'display',
    },
    degraded: {
      icon: (
        <AlertTriangle
          color={svgVariables.$yellow}
          style={{
            width: '100%',
            height: '80%',
          }}
        />
      ),
    },
    offline: {
      icon: (
        <ScreenShareOff
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
      icon: 'trigger',
    },
    degraded: {
      icon: (
        <AlertTriangle
          color={svgVariables.$yellow}
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
  Relay: {
    online: {
      icon: 'relay',
    },
    degraded: {
      icon: (
        <AlertTriangle
          color={svgVariables.$yellow}
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
}
