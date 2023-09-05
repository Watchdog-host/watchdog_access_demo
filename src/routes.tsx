// import AccessPage from 'pages/Access'
import CameraPage from 'pages/Camera'
import PrinterPage from 'pages/Printer'
import BarcodeScannerPage from 'pages/BarcodeScanner'
import LEDMatrixPage from 'pages/LEDMatrix'
import TriggerPage from 'pages/Trigger'
import RelayPage from 'pages/Relay'
import HomePage from 'pages/Home'
import AccountsPage from 'pages/Accounts'
import WatchlistPage from 'pages/Watchlist'
import PaymentsPage from 'pages/Payments'
import PlansPage from 'pages/Plans'
import AlertsPage from 'pages/Alerts'
import RevenuePage from 'pages/Revenue'
import AttendancePage from 'pages/Attendance'
import IdentitiesPage from 'pages/Watchlist/_pages/Identities'
import SettingsPage from 'pages/Settings'

const routes = [
  { path: `/`, element: <HomePage /> },
  // { path: `/Access`, element: <AccessPage /> },
  { path: `/Camera`, element: <CameraPage /> },
  { path: `/Printer`, element: <PrinterPage /> },
  { path: `/BarcodeScanner`, element: <BarcodeScannerPage /> },
  { path: `/LEDMatrix`, element: <LEDMatrixPage /> },
  { path: `/Trigger`, element: <TriggerPage /> },
  { path: `/Relay`, element: <RelayPage /> },
  { path: `/Watchlist`, element: <WatchlistPage /> },
  { path: `/Watchlist/:id/identities`, element: <IdentitiesPage /> },
  // { path: `/Alerts`, element: <AlertsPage /> },
  { path: `/Revenue`, element: <RevenuePage /> },
  // { path: `/Attendance`, element: <AttendancePage /> },
  // { path: `/Plans`, element: <PlansPage /> },
  // { path: `/Payments`, element: <PaymentsPage /> },
  { path: `/Accounts`, element: <AccountsPage /> },
  { path: `/Settings`, element: <SettingsPage /> },
  { path: `*`, element: <SettingsPage /> },
]

export default routes
