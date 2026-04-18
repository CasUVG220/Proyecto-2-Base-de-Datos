import { useState, useEffect } from 'react'
import axios from 'axios'
import Table  from '../components/Table'
import Modal  from '../components/Modal'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const empty = {
  categoria_id: '', proveedor_id: '', nombre: '', descripcion: '',
  precio_compra: '', precio_venta: '', stock: '', stock_minimo: '5'
}

export default function Productos() {
  const [data,        setData]        = useState([])
  const [categorias,  setCategorias]  = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [search,      setSearch]      = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editing,     setEditing]     = useState(null)
  const [form,        setForm]        = useState(empty)
  const [saving,      setSaving]      = useState(false)
  const [formError,   setFormError]   = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes, provRes] = await Promise.all([
        axios.get(`${API}/api/productos`),
        axios.get(`${API}/api/categorias`),
        axios.get(`${API}/api/proveedores`),
      ])
      setData(prodRes.data)
      setCategorias(catRes.data)
      setProveedores(provRes.data)
    } catch {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = data.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm(empty)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      categoria_id:  row.id,
      proveedor_id:  row.id,
      nombre:        row.nombre,
      descripcion:   row.descripcion || '',
      precio_compra: row.precio_compra,
      precio_venta:  row.precio_venta,
      stock:         row.stock,
      stock_minimo:  row.stock_minimo,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.categoria_id || !form.proveedor_id ||
        !form.precio_compra || !form.precio_venta) {
      setFormError('Completa todos los campos obligatorios')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await axios.put(`${API}/api/productos/${editing.id}`, form)
      } else {
        await axios.post(`${API}/api/productos`, form)
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!confirm(`¿Desactivar el producto "${row.nombre}"?`)) return
    try {
      await axios.delete(`${API}/api/productos/${row.id}`)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar')
    }
  }

  const columns = [
    { key: 'nombre',        label: 'Producto' },
    { key: 'categoria',     label: 'Categoría' },
    { key: 'proveedor',     label: 'Proveedor' },
    { key: 'precio_venta',  label: 'Precio',
      render: v => `Q ${parseFloat(v).toFixed(2)}` },
    { key: 'stock',         label: 'Stock',
      render: (v, row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
          ${v <= row.stock_minimo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {v}
        </span>
      )},
    { key: 'margen_pct',    label: 'Margen',
      render: v => v ? `${v}%` : '—' },
    { key: 'activo',        label: 'Estado',
      render: v => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
          ${v ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {v ? 'Activo' : 'Inactivo'}
        </span>
      )},
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Productos</h2>
          <p className="text-slate-500 text-sm mt-1">{data.length} productos registrados</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Nuevo producto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-center text-slate-400 py-8">Cargando...</p>
        ) : (
          <Table
            columns={columns}
            data={filtered}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                name="nombre" value={form.nombre} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="categoria_id" value={form.categoria_id} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Proveedor <span className="text-red-500">*</span>
              </label>
              <select
                name="proveedor_id" value={form.proveedor_id} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {proveedores.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio compra <span className="text-red-500">*</span>
              </label>
              <input
                type="number" step="0.01" name="precio_compra"
                value={form.precio_compra} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio venta <span className="text-red-500">*</span>
              </label>
              <input
                type="number" step="0.01" name="precio_venta"
                value={form.precio_venta} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock inicial</label>
              <input
                type="number" name="stock" value={form.stock} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock mínimo</label>
              <input
                type="number" name="stock_minimo" value={form.stock_minimo} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea
                name="descripcion" value={form.descripcion} onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}