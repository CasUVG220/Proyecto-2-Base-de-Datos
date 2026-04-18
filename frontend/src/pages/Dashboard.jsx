import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function StatCard({ title, value, subtitle, color }) {
  const colors = {
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    green:  'bg-green-50 border-green-200 text-green-700',
    amber:  'bg-amber-50 border-amber-200 text-amber-700',
    red:    'bg-red-50 border-red-200 text-red-700',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs mt-1 opacity-60">{subtitle}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [stats,     setStats]     = useState(null)
  const [stockBajo, setStockBajo] = useState([])
  const [topVentas, setTopVentas] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ventasRes, stockRes, topRes] = await Promise.all([
          axios.get(`${API}/api/reportes/ventas-mensuales`),
          axios.get(`${API}/api/reportes/stock-bajo`),
          axios.get(`${API}/api/reportes/productos-mas-vendidos?limite=5`),
        ])
        const ventas = ventasRes.data
        setStats({
          ingresos_mes:   ventas[0]?.ingresos      || 0,
          ventas_mes:     ventas[0]?.total_ventas  || 0,
          stock_bajo:     stockRes.data.length,
          ticket_prom:    ventas[0]?.ticket_promedio || 0,
        })
        setStockBajo(stockRes.data.slice(0, 5))
        setTopVentas(topRes.data)
      } catch (err) {
        setError('Error al cargar el dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      Cargando dashboard...
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
      {error}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Resumen del mes actual</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ingresos del mes"
          value={`Q ${parseFloat(stats.ingresos_mes).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
          color="blue"
        />
        <StatCard
          title="Ventas del mes"
          value={stats.ventas_mes}
          subtitle="transacciones completadas"
          color="green"
        />
        <StatCard
          title="Ticket promedio"
          value={`Q ${parseFloat(stats.ticket_prom).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
          color="amber"
        />
        <StatCard
          title="Stock bajo"
          value={stats.stock_bajo}
          subtitle="productos bajo mínimo"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top productos */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Productos más vendidos</h3>
          {topVentas.length === 0 ? (
            <p className="text-slate-400 text-sm">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {topVentas.map((p, i) => (
                <div key={p.producto_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{p.producto}</p>
                      <p className="text-xs text-slate-400">{p.categoria}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">{p.unidades_vendidas} uds</p>
                    <p className="text-xs text-slate-400">Q {parseFloat(p.ingresos_totales).toLocaleString('es-GT')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock bajo */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Alertas de stock bajo</h3>
          {stockBajo.length === 0 ? (
            <p className="text-slate-400 text-sm">Todo el stock está en niveles normales</p>
          ) : (
            <div className="space-y-3">
              {stockBajo.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{p.nombre}</p>
                    <p className="text-xs text-slate-400">{p.categoria}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      {p.stock} / {p.stock_minimo} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}