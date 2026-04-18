import { useState, useEffect } from 'react'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const tabs = [
  { key: 'ventas-empleado',   label: 'Ventas por empleado'   },
  { key: 'productos-vendidos', label: 'Productos más vendidos' },
  { key: 'ventas-categoria',  label: 'Ventas por categoría'  },
  { key: 'clientes-top',      label: 'Clientes top'          },
  { key: 'stock-bajo',        label: 'Stock bajo'            },
  { key: 'ventas-mensuales',  label: 'Ventas mensuales'      },
]

export default function Reportes() {
  const [activeTab, setActiveTab] = useState('ventas-empleado')
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const fetchReport = async (tab) => {
    setLoading(true)
    setError('')
    setData([])
    try {
      const endpointMap = {
        'ventas-empleado':    'ventas-por-empleado',
        'productos-vendidos': 'productos-mas-vendidos',
        'ventas-categoria':   'ventas-por-categoria',
        'clientes-top':       'clientes-top',
        'stock-bajo':         'stock-bajo',
        'ventas-mensuales':   'ventas-mensuales',
      }
      const { data } = await axios.get(`${API}/api/reportes/${endpointMap[tab]}`)
      setData(data)
    } catch {
      setError('Error al cargar el reporte')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport(activeTab) }, [activeTab])

  // exportar la info en CSV
  const exportCSV = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/reportes/exportar-csv`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'ventas.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error al exportar CSV')
    }
  }

  // ── Exportar PDF ────────────────────────────────────────────
  const exportPDF = () => {
    if (!data.length) return
    const doc      = new jsPDF()
    const tabLabel = tabs.find(t => t.key === activeTab)?.label || 'Reporte'

    doc.setFontSize(16)
    doc.text(`StoreManager — ${tabLabel}`, 14, 18)
    doc.setFontSize(10)
    doc.text(`Generado: ${new Date().toLocaleString('es-GT')}`, 14, 26)

    const columns = Object.keys(data[0]).map(k => ({ header: k, dataKey: k }))
    const rows    = data.map(row =>
      Object.values(row).map(v =>
        v === null || v === undefined ? '—' :
        typeof v === 'number' ? parseFloat(v).toLocaleString('es-GT') : String(v)
      )
    )

    autoTable(doc, {
      startY:   32,
      head:     [columns.map(c => c.header)],
      body:     rows,
      styles:   { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    })

    doc.save(`${activeTab}.pdf`)
  }

  //Columnas por reporte
  const columnDefs = {
    'ventas-empleado': [
      { key: 'empleado',        label: 'Empleado'         },
      { key: 'cargo',           label: 'Cargo'            },
      { key: 'total_ventas',    label: 'Ventas'           },
      { key: 'ingresos_totales',label: 'Ingresos',
        render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
      { key: 'ticket_promedio', label: 'Ticket prom.',
        render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
      { key: 'ultima_venta',    label: 'Última venta',
        render: v => v ? new Date(v).toLocaleDateString('es-GT') : '—' },
    ],
    'productos-vendidos': [
      { key: 'ranking',           label: '#'              },
      { key: 'producto',          label: 'Producto'       },
      { key: 'categoria',         label: 'Categoría'      },
      { key: 'unidades_vendidas', label: 'Unidades'       },
      { key: 'ingresos_totales',  label: 'Ingresos',
        render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
      { key: 'num_ventas',        label: 'Num. ventas'    },
    ],
    'ventas-categoria': [
      { key: 'categoria',        label: 'Categoría'       },
      { key: 'total_ventas',     label: 'Ventas'          },
      { key: 'unidades_vendidas',label: 'Unidades'        },
      { key: 'ingresos_totales', label: 'Ingresos',
        render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
      { key: 'precio_promedio',  label: 'Precio prom.',
        render: v => `Q ${parseFloat(v).toFixed(2)}`      },
    ],
    'clientes-top': [
      { key: 'cliente',        label: 'Cliente'           },
      { key: 'total_compras',  label: 'Compras'           },
      { key: 'total_gastado',  label: 'Total gastado',
        render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
      { key: 'ticket_promedio',label: 'Ticket prom.',
        render: v => `Q ${parseFloat(v).toFixed(2)}`      },
      { key: 'segmento',       label: 'Segmento',
        render: v => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
            ${v === 'VIP'       ? 'bg-purple-100 text-purple-700' :
              v === 'Frecuente' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-600'}`}>
            {v}
          </span>
        )},
    ],
    'stock-bajo': [
      { key: 'nombre',             label: 'Producto'      },
      { key: 'categoria',          label: 'Categoría'     },
      { key: 'proveedor',          label: 'Proveedor'     },
      { key: 'stock',              label: 'Stock actual',
        render: v => (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            {v}
          </span>
        )},
      { key: 'stock_minimo',       label: 'Mínimo'        },
      { key: 'unidades_faltantes', label: 'Faltantes',
        render: v => (
          <span className="font-semibold text-red-600">{v}</span>
        )},
      { key: 'proveedor_email',    label: 'Contacto'      },
    ],
    'ventas-mensuales': [
      { key: 'mes',             label: 'Mes'              },
      { key: 'total_ventas',    label: 'Ventas'           },
      { key: 'ingresos',        label: 'Ingresos',
        render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
      { key: 'ticket_promedio', label: 'Ticket prom.',
        render: v => `Q ${parseFloat(v).toFixed(2)}`      },
      { key: 'ventas_anuladas', label: 'Anuladas',
        render: v => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
            ${v > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {v}
          </span>
        )},
    ],
  }

  const columns = columnDefs[activeTab] || []

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reportes</h2>
          <p className="text-slate-500 text-sm mt-1">Consultas avanzadas sobre la base de datos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Exportar CSV
          </button>
          <button
            onClick={exportPDF}
            disabled={!data.length}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1 flex gap-1 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SQL Badge — muestra qué tipo de query usa cada reporte */}
      <div className="flex gap-2 flex-wrap">
        {activeTab === 'ventas-empleado'    && <Badge color="blue"   text="VIEW + JOIN múltiple + GROUP BY" />}
        {activeTab === 'productos-vendidos' && <Badge color="purple" text="CTE (WITH) + RANK() + JOIN" />}
        {activeTab === 'ventas-categoria'   && <Badge color="green"  text="GROUP BY + HAVING + Agregación" />}
        {activeTab === 'clientes-top'       && <Badge color="amber"  text="Subquery en FROM (tabla derivada)" />}
        {activeTab === 'stock-bajo'         && <Badge color="red"    text="Subquery con EXISTS" />}
        {activeTab === 'ventas-mensuales'   && <Badge color="teal"   text="CTE + DATE_TRUNC + GROUP BY" />}
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-400 py-12">Cargando reporte...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-slate-400 py-12">Sin datos para mostrar</p>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-3">{data.length} registros encontrados</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {columns.map(col => (
                      <th key={col.key}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      {columns.map(col => (
                        <td key={col.key} className="px-4 py-3 text-slate-700">
                          {col.render
                            ? col.render(row[col.key], row)
                            : (row[col.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Badge({ color, text }) {
  const colors = {
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green:  'bg-green-100 text-green-700',
    amber:  'bg-amber-100 text-amber-700',
    red:    'bg-red-100 text-red-700',
    teal:   'bg-teal-100 text-teal-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {text}
    </span>
  )
}