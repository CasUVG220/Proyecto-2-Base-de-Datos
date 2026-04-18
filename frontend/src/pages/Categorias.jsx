import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import Modal from '../components/Modal'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const empty = { nombre: '', descripcion: '' }

export default function Categorias() {
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(empty)
  const [saving,    setSaving]    = useState(false)
  const [formError, setFormError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API}/api/categorias`)
      setData(data)
    } catch {
      setError('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(empty)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ nombre: row.nombre, descripcion: row.descripcion || '' })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre) {
      setFormError('El nombre es obligatorio')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await axios.put(`${API}/api/categorias/${editing.id}`, form)
      } else {
        await axios.post(`${API}/api/categorias`, form)
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
    if (!confirm(`¿Eliminar la categoría "${row.nombre}"?`)) return
    try {
      await axios.delete(`${API}/api/categorias/${row.id}`)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar')
    }
  }

  const columns = [
    { key: 'nombre',           label: 'Nombre' },
    { key: 'descripcion',      label: 'Descripción' },
    { key: 'total_productos',  label: 'Productos',
      render: v => (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {v}
        </span>
      )},
    { key: 'creado_en', label: 'Creado',
      render: v => new Date(v).toLocaleDateString('es-GT') },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Categorías</h2>
          <p className="text-slate-500 text-sm mt-1">{data.length} categorías registradas</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Nueva categoría
        </button>
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
          <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar categoría' : 'Nueva categoría'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              name="descripcion" value={form.descripcion} onChange={handleChange}
              rows={3}
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
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}