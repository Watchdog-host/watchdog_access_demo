import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Route, Routes, useNavigate } from 'react-router-dom'

import routes from 'routes'
import Login from 'pages/Login'
import { ProtectedRoute } from 'components'
import { useAppDispatch } from 'store/hooks'
import { useProfileQuery } from 'store/endpoints'
import { setSelectedEdgeKey } from 'store/slices/navigation'

import './App.scss'
import 'assets/scss/index.scss'

import useWebSocket from 'react-use-websocket'
import withInternetStatus from 'hocs/withOfflineSync'

function App() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: profileData, error } = useProfileQuery()

  useEffect(() => {
    const errorData = error as any
    const status = errorData?.status

    if (status === 401) {
      toast.error('Not logged in')
      navigate('/login')
    }
    dispatch(setSelectedEdgeKey(profileData?.edge_id))
  }, [error])

  // const {
  //   sendMessage,
  //   sendJsonMessage,
  //   lastMessage,
  //   lastJsonMessage,
  //   readyState,
  //   getWebSocket,
  // } = useWebSocket('wss://echo.websocket.org', {
  //   onOpen: () => console.log('opened'),
  //   shouldReconnect: (closeEvent) => true,
  // });

  // sendMessage(JSON.stringify({id:1}))

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {routes.map(({ element, path }, key) => (
          <Route {...{ element, path }} key={key} />
        ))}
      </Route>
      <Route element={<Login />} path="/login" />
    </Routes>
  )
}

export default withInternetStatus(App)
