'use client'

import { useState } from 'react'

interface Tratamiento {
  id: number
  nombre: string
  categoria: 'Preventiva' | 'Restauradora' | 'Endodoncia' | 'Periodoncia' | 'Cirugía' | 'Estética' | 'Ortodoncia' | 'Otros'
  precio: number
  duracion: number // en minutos
  descripcion: string
  activo: boolean
  vecesRealizado?: number
}

export default function TratamientosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('Todos')
  const [showModal, setShowModal] = useState(false)
  const [editingTratamiento, setEditingTratamiento] = useState<Tratamiento | null>(null)

  const categorias = [
    'Preventiva',
    'Restauradora', 
    'Endodoncia',
    'Periodoncia',
    'Cirugía',
    'Estética',
    'Ortodoncia',
    'Otros'
  ]

  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([
    { id: 1, nombre: 'Limpieza dental', categoria: 'Preventiva', precio: 80, duracion: 30, descripcion: 'Profilaxis y remoción de placa bacteriana', activo: true, vecesRealizado: 45 },
    { id: 2, nombre: 'Obturación con resina', categoria: 'Restauradora', precio: 150, duracion: 45, descripcion: 'Restauración de caries con composite', activo: true, vecesRealizado: 38 },
    { id: 3, nombre: 'Endodoncia unirradicular', categoria: 'Endodoncia', precio: 400, duracion: 90, descripcion: 'Tratamiento de conducto de una raíz', activo: true, vecesRealizado: 15 },
    { id: 4, nombre: 'Extracción simple', categoria: 'Cirugía', precio: 120, duracion: 30, descripcion: 'Extracción de pieza dental sin complicaciones', activo: true, vecesRealizado: 28 },
    { id: 5, nombre: 'Blanqueamiento dental', categoria: 'Estética', precio: 500, duracion: 60, descripcion: 'Blanqueamiento profesional en consultorio', activo: true, vecesRealizado: 22 },
    { id: 6, nombre: 'Corona de porcelana', categoria: 'Restauradora', precio: 800, duracion: 120, descripcion: 'Prótesis fija de porcelana', activo: true, vecesRealizado: 12 },
    { id: 7, nombre: 'Ortodoncia metálica', categoria: 'Ortodoncia', precio: 2500, duracion: 30, descripcion: 'Tratamiento de ortodoncia con brackets metálicos (por mes)', activo: true, vecesRealizado: 8 },
    { id: 8, nombre: 'Implante dental', categoria: 'Cirugía', precio: 1500, duracion: 120, descripcion: 'Colocación de implante de titanio', activo: true, vecesRealizado: 6 },
  ])

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Preventiva' as Tratamiento['categoria'],
    precio: '',
    duracion: '',
    descripcion: ''
  })

  // Filtrar tratamientos
  const filteredTratamientos = tratamientos.filter(tratamiento => {
    const matchesSearch = 
      tratamiento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tratamiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategoria = filterCategoria === 'Todos' || tratamiento.categoria === filterCategoria

    return matchesSearch && matchesCategoria && tratamiento.activo
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTratamiento) {
      // Editar tratamiento
      setTratamientos(tratamientos.map(t => 
        t.id === editingTratamiento.id 
          ? {
              ...t,
              nombre: formData.nombre,
              categoria: formData.categoria,
              precio: parseFloat(formData.precio),
              duracion: parseInt(formData.duracion),
              descripcion: formData.descripcion
            }
          : t
      ))
    } else {
      // Crear nuevo tratamiento
      const newTratamiento: Tratamiento = {
        id: tratamientos.length + 1,
        nombre: formData.nombre,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion),
        descripcion: formData.descripcion,
        activo: true,
        vecesRealizado: 0
      }
      setTratamientos([...tratamientos, newTratamiento])
    }

    // Cerrar modal y limpiar
    setShowModal(false)
    setEditingTratamiento(null)
    setFormData({
      nombre: '',
      categoria: 'Preventiva',
      precio: '',
      duracion: '',
      descripcion: ''
    })
  }

  const handleEdit = (tratamiento: Tratamiento) => {
    setEditingTratamiento(tratamiento)
    setFormData({
      nombre: tratamiento.nombre,
      categoria: tratamiento.categoria,
      precio: tratamiento.precio.toString(),
      duracion: tratamiento.duracion.toString(),
      descripcion: tratamiento.descripcion
    })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de desactivar este tratamiento?')) {
      setTratamientos(tratamientos.map(t => 
        t.id === id ? { ...t, activo: false } : t
      ))
    }
  }

  const getCategoriaColor = (categoria: string) => {
    const colores: Record<string, string> = {
      'Preventiva': 'bg-green-100 text-green-700',
      'Restauradora': 'bg-blue-100 text-blue-700',
      'Endodoncia': 'bg-purple-100 text-purple-700',
      'Periodoncia': 'bg-pink-100 text-pink-700',
      'Cirugía': 'bg-red-100 text-red-700',
      'Estética': 'bg-yellow-100 text-yellow-700',
      'Ortodoncia': 'bg-indigo-100 text-indigo-700',
      'Otros': 'bg-gray-100 text-gray-700'
    }
    return colores[categoria] || 'bg-gray-100 text-gray-700'
  }

  const getCategoriaIcon = (categoria: string) => {
    const iconos: Record<string, string> = {
      'Preventiva': '🛡️',
      'Restauradora': '🔧',
      'Endodoncia': '🦷',
      'Periodoncia': '💉',
      'Cirugía': '⚕️',
      'Estética': '✨',
      'Ortodoncia': '📐',
      'Otros': '📋'
    }
    return iconos[categoria] || '📋'
  }

  // Calcular estadísticas
  const totalTratamientos = tratamientos.filter(t => t.activo).length
  const ingresoPromedio = tratamientos.reduce((sum, t) => sum + t.precio, 0) / tratamientos.length
  const duracionPromedio = tratamientos.reduce((sum, t) => sum + t.duracion, 0) / tratamientos.length

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tratamientos</p>
              <p className="text-3xl font-bold text-gray-800">{totalTratamientos}</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Precio Promedio</p>
              <p className="text-3xl font-bold text-green-600">S/ {ingresoPromedio.toFixed(0)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Duración Promedio</p>
              <p className="text-3xl font-bold text-blue-600">{duracionPromedio.toFixed(0)} min</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Más Popular</p>
              <p className="text-xl font-bold text-purple-600">
                {tratamientos.sort((a, b) => (b.vecesRealizado || 0) - (a.vecesRealizado || 0))[0]?.nombre.substring(0, 15)}...
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Búsqueda */}
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar tratamiento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Filtro de categoría */}
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="Todos">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>

          {/* Botón agregar */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Tratamiento
          </button>
        </div>
      </div>

      {/* Grid de tratamientos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTratamientos.map((tratamiento) => (
          <div key={tratamiento.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="p-6">
              {/* Header con categoría */}
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoriaColor(tratamiento.categoria)} flex items-center gap-1`}>
                  <span>{getCategoriaIcon(tratamiento.categoria)}</span>
                  {tratamiento.categoria}
                </span>
                {tratamiento.vecesRealizado !== undefined && tratamiento.vecesRealizado > 0 && (
                  <span className="text-xs text-gray-500">
                    {tratamiento.vecesRealizado}x realizado
                  </span>
                )}
              </div>

              {/* Nombre */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{tratamiento.nombre}</h3>
              
              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tratamiento.descripcion}</p>

              {/* Precio y duración */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Precio</p>
                  <p className="text-2xl font-bold text-green-600">S/ {tratamiento.precio}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Duración</p>
                  <p className="text-lg font-semibold text-gray-800">{tratamiento.duracion} min</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tratamiento)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(tratamiento.id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                >
                  Desactivar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sin resultados */}
      {filteredTratamientos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">No se encontraron tratamientos</p>
          <p className="text-gray-500 text-sm mt-1">Intenta con otros criterios de búsqueda</p>
        </div>
      )}

      {/* Modal para crear/editar tratamiento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                {editingTratamiento ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingTratamiento(null)
                  setFormData({
                    nombre: '',
                    categoria: 'Preventiva',
                    precio: '',
                    duracion: '',
                    descripcion: ''
                  })
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Tratamiento *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ej: Limpieza dental"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (S/) *
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="150"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (min) *
                  </label>
                  <input
                    type="number"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="30"
                    min="0"
                    step="5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={4}
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe brevemente en qué consiste el tratamiento..."
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTratamiento(null)
                    setFormData({
                      nombre: '',
                      categoria: 'Preventiva',
                      precio: '',
                      duracion: '',
                      descripcion: ''
                    })
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  {editingTratamiento ? 'Actualizar' : 'Guardar'} Tratamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}