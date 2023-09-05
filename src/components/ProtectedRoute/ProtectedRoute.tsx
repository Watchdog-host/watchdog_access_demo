import { Navigate, Outlet } from 'react-router-dom'

import Layout from 'components/Layout'

const ProtectedRoute = () => {
  const isAuth = localStorage.getItem('token')

  return isAuth ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  )
}

export default ProtectedRoute
