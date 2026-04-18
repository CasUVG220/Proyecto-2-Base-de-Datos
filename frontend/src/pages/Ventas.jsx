import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Ventas() {
  const [ventas,      setVentas]      = useState([])
  const [clientes,    setClientes]    = useState([])
  const [empleados,   setEmpleados]   = useState([])
  const [productos,   setProductos]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [detailOpen,  setDetailOpen]  = useState(false)
  const [selected,    setSelected]    = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [formError,   setFormError]   = useState('')
  const [form,        setForm]        = useState({ cliente_id: '', empleado_id: '', notas: '' })
  const [lineas,      setLineas]      = useState([{ producto_id: '', cantidad: 1 }])

  const fetchVentas = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API}/api/ventas`)
      setVentas(data)
    } catch {
      setError('Error al cargar ventas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vRes, cRes, eRes, pRes] = await Promise.all([
          axios.get(`${API}/api/ventas`),
          axios.get(`${API}/api/clientes`),
          axios.get(`${API}/api/empleados`),
          axios.get(`${API}/api/productos`),
        ])
        setVentas(vRes.data)
        setClientes(cRes.data.filter(c => c.activo))
        setEmpleados(eRes.data.filter(e => e.activo))
        setProductos(pRes.data.filter(p => p.activo))
      } catch {
        setError('Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const openCreate = () => {
    setForm({ cliente_id: '', empleado_id: '', notas: '' })
    setLineas([{ producto_id: '', cantidad: 1 }])
    setFormError('')
    setModalOpen(true)
  }

  const openDetail = async (row) => {
    try {
      const { data } = await axios.get(`${API}/api/ventas/${row.id}`)
      setSelected(data)
      setDetailOpen(true)
    } catch {
      alert('Error al cargar detalle')
    }
  }

  const addLinea = () => {
    setLineas([...lineas, { producto_id: '', cantidad: 1 }])
  }

  const removeLinea = (i) => {
    if (lineas.length === 1) return
    setLineas(lineas.filter((_, idx) => idx !== i))
  }

  const updateLinea = (i, field, value) => {
    const updated = [...lineas]
    updated[i][field] = value
    setLineas(updated)
  }

  const calcTotal = () => {
    return lineas.reduce((acc, l) => {
      const prod = productos.find(p => p.id === parseInt(l.producto_id))
      if (!prod || !l.cantidad) return acc
      return acc + (parseFloat(prod.precio_venta) * parseInt(l.cantidad))
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.cliente_id || !form.empleado_id) {
      setFormError('Cliente y empleado son obligatorios')
      return
    }
    if (lineas.some(l => !l.producto_id || !l.cantidad)) {
      setFormError('Completa todos los productos y cantidades')
      return
    }
    setSaving(true)
    try {
      await axios.post(`${API}/api/ventas`, {
        ...form,
        lineas: lineas.map(l => ({
          producto_id: parseInt(l.producto_id),
          cantidad:    parseInt(l.cantidad),
        }))
      })
      setModalOpen(false)
      fetchVentas()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al registrar venta')
    } finally {
      setSaving(false)
    }
  }

  const handleAnular = async (row) => {
    if (!confirm(`¿Anular la venta #${row.id}? Esta acción restaurará el stock.`)) return
    try {
      await axios.put(`${API}/api/ventas/${row.id}/anular`)
      fetchVentas()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al anular')
    }
  }

  const subtotal = calcTotal()
  const impuesto = subtotal * 0.12
  const total    = subtotal + impuesto

  const columns = [
    { key: 'id',       label: '#',
      render: v => <span className="font-mono text-slate-500">#{v}</span> },
    { key: 'fecha',    label: 'Fecha',
      render: v => new Date(v).toLocaleString('es-GT') },
    { key: 'cliente',  label: 'Cliente' },
    { key: 'empleado', label: 'Empleado' },
    { key: 'total',    label: 'Total',
      render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
    { key: 'estado',   label: 'Estado',
      render: v => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
          ${v === 'completada' ? 'bg-green-100 text-green-700' :
            v === 'anulada'    ? 'bg-red-100 text-red-700' :
                                 'bg-amber-100 text-amber-700'}`}>
          {v}
        </span>
      )},
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ventas</h2>
          <p className="text-slate-500 text-sm mt-1">{ventas.length} ventas registradas</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Nueva venta
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {loading ? (
          <p className="text-center text-slate-400 py-8">Cargando...</p>
        ) : (
          <Table
            columns={columns}
            data={ventas}
            onEdit={openDetail}
            extraActions={(row) =>
              row.estado === 'completada' && (
                <button
                  onClick={() => handleAnular(row)}
                  className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded hover:bg-red-50"
                >
                  Anular
                </button>
              )
            }
          />
        )}
      </div>

      {/* Modal nueva venta */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva venta"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cliente <span className="text-red-500">*</span>
              </label>
              <select
                value={form.cliente_id}
                onChange={e => setForm({ ...form, cliente_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Empleado <span className="text-red-500">*</span>
              </label>
              <select
                value={form.empleado_id}
                onChange={e => setForm({ ...form, empleado_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar empleado...</option>
                {empleados.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Líneas de productos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                Productos <span className="text-red-500">*</span>
              </label>
              <button
                type="button" onClick={addLinea}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                + Agregar producto
              </button>
            </div>

            <div className="space-y-2">
              {lineas.map((linea, i) => {
                const prod = productos.find(p => p.id === parseInt(linea.producto_id))
                return (
                  <div key={i} className="flex gap-2 items-center">
                    <select
                      value={linea.producto_id}
                      onChange={e => updateLinea(i, 'producto_id', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar producto...</option>
                      {productos.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} — Q{parseFloat(p.precio_venta).toFixed(2)} (stock: {p.stock})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number" min="1"
                      value={linea.cantidad}
                      onChange={e => updateLinea(i, 'cantidad', e.target.value)}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-500 w-24 text-right">
                      {prod ? `Q ${(parseFloat(prod.precio_venta) * (parseInt(linea.cantidad) || 0)).toFixed(2)}` : '—'}
                    </span>
                    <button
                      type="button" onClick={() => removeLinea(i)}
                      className="text-red-400 hover:text-red-600 font-bold text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Totales */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>Q {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA (12%)</span>
              <span>Q {impuesto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-800 border-t pt-1 mt-1">
              <span>Total</span>
              <span>Q {total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
            <textarea
              value={form.notas}
              onChange={e => setForm({ ...form, notas: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
            >
              {saving ? 'Registrando...' : 'Registrar venta'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal detalle */}
      <Modal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={`Detalle de venta #${selected?.id}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Cliente</p>
                <p className="font-medium">{selected.cliente}</p>
              </div>
              <div>
                <p className="text-slate-500">Empleado</p>
                <p className="font-medium">{selected.empleado}</p>
              </div>
              <div>
                <p className="text-slate-500">Fecha</p>
                <p className="font-medium">{new Date(selected.fecha).toLocaleString('es-GT')}</p>
              </div>
              <div>
                <p className="text-slate-500">Estado</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${selected.estado === 'completada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selected.estado}
                </span>
              </div>
            </div>

            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-slate-500">Producto</th>
                  <th className="px-3 py-2 text-left text-xs text-slate-500">Categoría</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500">Cant.</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500">Precio</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selected.lineas?.map(l => (
                  <tr key={l.id}>
                    <td className="px-3 py-2">{l.producto}</td>
                    <td className="px-3 py-2 text-slate-500">{l.categoria}</td>
                    <td className="px-3 py-2 text-right">{l.cantidad}</td>
                    <td className="px-3 py-2 text-right">Q {parseFloat(l.precio_unitario).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-medium">Q {parseFloat(l.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-slate-50 rounded-lg p-4 space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Q {parseFloat(selected.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA (12%)</span>
                <span>Q {parseFloat(selected.impuesto).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-800 border-t pt-1">
                <span>Total</span>
                <span>Q {parseFloat(selected.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}