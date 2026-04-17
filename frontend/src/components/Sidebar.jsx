import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/',            label: 'Dashboard'   },
  { to: '/productos',   label: 'Productos'   },
  { to: '/categorias',  label: 'Categorías'  },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/clientes',    label: 'Clientes'    },
  { to: '/empleados',   label: 'Empleados'   },
  { to: '/ventas',      label: 'Ventas'      },
  { to: '/reportes',    label: 'Reportes'    },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold text-blue-400">StoreManager</h1>
        <p className="text-xs text-slate-400 mt-1">Sistema de Inventario</p>
      </div>

      {/* Usuario */}
      <div className="px-6 py-4 border-b border-slate-700">
        <p className="text-sm font-medium">{user?.nombre} {user?.apellido}</p>
        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
          {user?.rol}
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors
               ${isActive
                 ? 'bg-blue-600 text-white font-medium'
                 : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}