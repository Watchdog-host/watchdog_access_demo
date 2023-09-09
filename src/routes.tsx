import { lazy } from 'react'
import HomePage from 'pages/Home'
import { AccountTypeEnum } from 'constants/enums'

const LazyCameraPage = lazy(() => import('pages/Camera'))
const LazyPrinterPage = lazy(() => import('pages/Printer'))
const LazyBarcodeScannerPage = lazy(() => import('pages/BarcodeScanner'))
const LazyLEDMatrixPage = lazy(() => import('pages/LEDMatrix'))
const LazyTriggerPage = lazy(() => import('pages/Trigger'))
const LazyRelayPage = lazy(() => import('pages/Relay'))
const LazyWatchlistPage = lazy(() => import('pages/Watchlist'))
const LazyAlertsPage = lazy(() => import('pages/Alerts'))
const LazyRevenuePage = lazy(() => import('pages/Revenue'))
const LazyIdentitiesPage = lazy(() => import('pages/Watchlist/_pages/Identities'))

// const LazyAttendancePage = lazy(()=>import('pages/Attendance'))
// const LazyPlansPage = lazy(()=>import('pages/Plans'))
// const LazyPaymentsPage = lazy(()=>import('pages/Payments'))

const LazyAccountsPage = lazy(() => import('pages/Accounts'))
const LazySettingsPage = lazy(() => import('pages/Settings'))

const routes = [
  { path: `/`, element: <HomePage />, min_role: AccountTypeEnum.Owner },
  { path: `/Camera`, element: <LazyCameraPage />, min_role: AccountTypeEnum.Operator },
  { path: `/Printer`, element: <LazyPrinterPage />, min_role: AccountTypeEnum.Operator },
  { path: `/BarcodeScanner`, element: <LazyBarcodeScannerPage />, min_role: AccountTypeEnum.Operator },
  { path: `/LEDMatrix`, element: <LazyLEDMatrixPage />, min_role: AccountTypeEnum.Operator },
  { path: `/Trigger`, element: <LazyTriggerPage />, min_role: AccountTypeEnum.Operator },
  { path: `/Relay`, element: <LazyRelayPage />, min_role: AccountTypeEnum.Operator },
  { path: `/Watchlists`, element: <LazyWatchlistPage />, min_role: AccountTypeEnum.Operator },
  { path: `/Watchlists/:id/identities`, element: <LazyIdentitiesPage />, min_role: AccountTypeEnum.Operator },
  { path: `/Alerts`, element: <LazyAlertsPage />, min_role: AccountTypeEnum.Customer },
  { path: `/Revenue`, element: <LazyRevenuePage />, min_role: AccountTypeEnum.Customer },
  // { path: `/Attendance`, element: <LazyAttendancePage />, min_role: AccountTypeEnum.Customer },
  // { path: `/Plans`, element: <LazyPlansPage />, min_role: AccountTypeEnum.Viewer },
  // { path: `/Payments`, element: <LazyPaymentsPage />, min_role: AccountTypeEnum.Viewer },
  { path: `/Accounts`, element: <LazyAccountsPage />, min_role: AccountTypeEnum.Customer },
  { path: `/Settings`, element: <LazySettingsPage />, min_role: AccountTypeEnum.Admin },
  { path: `*`, element: <HomePage />, min_role: AccountTypeEnum.Viewer },
]

export default routes
