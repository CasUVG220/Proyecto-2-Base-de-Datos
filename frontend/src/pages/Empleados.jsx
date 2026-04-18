import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const empty = { nombre: '', apellido: '', cargo: '', telefono: '', email: '', salario: '' }

export default function Empleados() {
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(empty)
  const [saving,    setSaving]    = useState(false)
  const [formError, setFormError] = useState('')
  const [search,    setSearch]    = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API}/api/empleados`)
      setData(data)
    } catch {
      setError('Error al cargar empleados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = data.filter(e =>
    `${e.nombre} ${e.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
    e.cargo.toLowerCase().includes(search.toLowerCase())
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
      nombre:   row.nombre,
      apellido: row.apellido,
      cargo:    row.cargo,
      telefono: row.telefono || '',
      email:    row.email    || '',
      salario:  row.salario,
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
    if (!form.nombre || !form.apellido || !form.cargo || !form.salario) {
      setFormError('Nombre, apellido, cargo y salario son obligatorios')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await axios.put(`${API}/api/empleados/${editing.id}`, form)
      } else {
        await axios.post(`${API}/api/empleados`, form)
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
    if (!confirm(`¿Desactivar al empleado "${row.nombre} ${row.apellido}"?`)) return
    try {
      await axios.delete(`${API}/api/empleados/${row.id}`)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar')
    }
  }

  const columns = [
    { key: 'nombre',             label: 'Nombre',
      render: (v, row) => `${v} ${row.apellido}` },
    { key: 'cargo',              label: 'Cargo' },
    { key: 'email',              label: 'Email' },
    { key: 'salario',            label: 'Salario',
      render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
    { key: 'total_ventas',       label: 'Ventas',
      render: v => (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {v}
        </span>
      )},
    { key: 'ingresos_generados', label: 'Ingresos',
      render: v => `Q ${parseFloat(v).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` },
    { key: 'activo', label: 'Estado',
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
          <h2 className="text-2xl font-bold text-slate-800">Empleados</h2>
          <p className="text-slate-500 text-sm mt-1">{data.length} empleados registrados</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Nuevo empleado
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <input
          type="text"
          placeholder="Buscar por nombre o cargo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-center text-slate-400 py-8">Cargando...</p>
        ) : (
          <Table columns={columns} data={filtered} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar empleado' : 'Nuevo empleado'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
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
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                name="apellido" value={form.apellido} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cargo <span className="text-red-500">*</span>
              </label>
              <input
                name="cargo" value={form.cargo} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Salario <span className="text-red-500">*</span>
              </label>
              <input
                type="number" step="0.01" name="salario"
                value={form.salario} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                name="telefono" value={form.telefono} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
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
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear empleado'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}