import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Productos  from './pages/Productos'
import Categorias from './pages/Categorias'
import Proveedores from './pages/Proveedores'
import Clientes   from './pages/Clientes'
import Empleados  from './pages/Empleados'
import Ventas     from './pages/Ventas'
import Reportes   from './pages/Reportes'
import Sidebar    from './components/Sidebar'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  return user ? children : <Navigate to="/login" />
}

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          }/>
          <Route path="/productos" element={
            <PrivateRoute><Layout><Productos /></Layout></PrivateRoute>
          }/>
          <Route path="/categorias" element={
            <PrivateRoute><Layout><Categorias /></Layout></PrivateRoute>
          }/>
          <Route path="/proveedores" element={
            <PrivateRoute><Layout><Proveedores /></Layout></PrivateRoute>
          }/>
          <Route path="/clientes" element={
            <PrivateRoute><Layout><Clientes /></Layout></PrivateRoute>
          }/>
          <Route path="/empleados" element={
            <PrivateRoute><Layout><Empleados /></Layout></PrivateRoute>
          }/>
          <Route path="/ventas" element={
            <PrivateRoute><Layout><Ventas /></Layout></PrivateRoute>
          }/>
          <Route path="/reportes" element={
            <PrivateRoute><Layout><Reportes /></Layout></PrivateRoute>
          }/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}