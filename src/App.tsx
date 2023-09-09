import { Suspense, memo } from 'react'
import { Route, Routes } from 'react-router-dom'

import routes from 'routes'
import Login from 'pages/Login'
import { Loader, ProtectedRoute } from 'components'

import './App.scss'
import 'assets/scss/index.scss'

import { AccountTypeEnum } from 'constants/enums'
import { useLocalStorage } from 'react-use'
import { IProfileDTO } from 'types'

function App() {
  const [localProfile] = useLocalStorage<IProfileDTO>('profile')
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {routes
          .filter((item) => item.min_role >= (localProfile ? localProfile?.type : AccountTypeEnum.Owner))
          .map(({ element, path }, key) => (
            <Route {...{ element, path }} path={path} element={<Suspense children={element} fallback={<Loader />} />} key={key} />
          ))}
      </Route>
      <Route element={<Login />} path="/login" />
    </Routes>
  )
}

export default memo(App)
