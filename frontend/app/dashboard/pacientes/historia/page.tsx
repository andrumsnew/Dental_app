'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface HistoriaClinica {
  id: number
  pacienteId: number
  pacienteNombre: string
  pacienteApellido: string
  dni: string
  fecha: string
  tratamiento: string
  pieza?: string
  descripcion: string
  odontologo: string
  costo: number
  estado: 'Completado' | 'En proceso' | 'Pendiente'
}

export default function HistoriaGeneralPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTratamiento, setFilterTratamiento] = useState('Todos')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Datos de ejemplo - vendrían del backend
  const [historias, setHistorias] = useState<HistoriaClinica[]>([
    {
      id: 1,
      pacienteId: 1,
      pacienteNombre: 'María',
      pacienteApellido: 'García López',
      dni: '45678912',
      fecha: '2024-11-15',
      tratamiento: 'Limpieza dental',
      descripcion: 'Limpieza profunda con ultrasonido',
      odontologo: 'Dr. García',
      costo: 120,
      estado: 'Completado'
    },
    {
      id: 2,
      pacienteId: 1,
      pacienteNombre: 'María',
      pacienteApellido: 'García López',
      dni: '45678912',
      fecha: '2024-10-15',
      tratamiento: 'Extracción',
      pieza: '28',
      descripcion: 'Extracción de muela del juicio superior derecha',
      odontologo: 'Dra. Rodríguez',
      costo: 250,
      estado: 'Completado'
    },
    {
      id: 3,
      pacienteId: 2,
      pacienteNombre: 'Juan',
      pacienteApellido: 'Pérez Torres',
      dni: '12345678',
      fecha: '2024-11-10',
      tratamiento: 'Obturación',
      pieza: '16',
      descripcion: 'Caries oclusal, obturación con resina',
      odontologo: 'Dr. García',
      costo: 150,
      estado: 'Completado'
    },
    {
      id: 4,
      pacienteId: 3,
      pacienteNombre: 'Ana',
      pacienteApellido: 'Torres Ramos',
      dni: '78945612',
      fecha: '2024-11-12',
      tratamiento: 'Endodoncia',
      pieza: '36',
      descripcion: 'Tratamiento de conducto en progreso',
      odontologo: 'Dr. Martínez',
      costo: 800,
      estado: 'En proceso'
    },
    {
      id: 5,
      pacienteId: 4,
      pacienteNombre: 'Carlos',
      pacienteApellido: 'Ruiz Mendoza',
      dni: '98765432',
      fecha: '2024-11-20',
      tratamiento: 'Corona',
      pieza: '26',
      descripcion: 'Instalación de corona de porcelana programada',
      odontologo: 'Dra. Rodríguez',
      costo: 600,
      estado: 'Pendiente'
    },
    {
      id: 6,
      pacienteId: 5,
      pacienteNombre: 'Lucía',
      pacienteApellido: 'Fernández Silva',
      dni: '65432198',
      fecha: '2024-11-08',
      tratamiento: 'Ortodoncia',
      descripcion: 'Control mensual de brackets',
      odontologo: 'Dr. García',
      costo: 200,
      estado: 'Completado'
    },
  ])

  // Tratamientos únicos para el filtro
  const tratamientos = ['Todos', ...new Set(historias.map(h => h.tratamiento))]

  // Filtrar historias
  const filteredHistorias = historias.filter(historia => {
    const matchesSearch = 
      historia.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      historia.pacienteApellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      historia.dni.includes(searchTerm) ||
      historia.tratamiento.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTratamiento = filterTratamiento === 'Todos' || historia.tratamiento === filterTratamiento
    const matchesEstado = filterEstado === 'Todos' || historia.estado === filterEstado

    let matchesDate = true
    if (dateFrom && dateTo) {
      const historiaDate = new Date(historia.fecha)
      matchesDate = historiaDate >= new Date(dateFrom) && historiaDate <= new Date(dateTo)
    }

    return matchesSearch && matchesTratamiento && matchesEstado && matchesDate
  })

  // Estadísticas
  const totalTratamientos = historias.length
  const completados = historias.filter(h => h.estado === 'Completado').length
  const enProceso = historias.filter(h => h.estado === 'En proceso').length
  const pendientes = historias.filter(h => h.estado === 'Pendiente').length
  const ingresoTotal = historias.filter(h => h.estado === 'Completado').reduce((sum, h) => sum + h.costo, 0)

  const verDetallePaciente = (pacienteId: number) => {
    router.push(`/dashboard/pacientes/${pacienteId}`)
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tratamientos</p>
              <p className="text-3xl font-bold text-gray-800">{totalTratamientos}</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completados</p>
              <p className="text-3xl font-bold text-green-600">{completados}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En Proceso</p>
              <p className="text-3xl font-bold text-yellow-600">{enProceso}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-red-600">{pendientes}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Ingreso Total</p>
              <p className="text-3xl font-bold">S/ {ingresoTotal.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Paciente, DNI, tratamiento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Filtro por tratamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tratamiento</label>
            <select
              value={filterTratamiento}
              onChange={(e) => setFilterTratamiento(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {tratamientos.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="Todos">Todos</option>
              <option value="Completado">Completado</option>
              <option value="En proceso">En proceso</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          {/* Exportar */}
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Filtro por fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabla de historias */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">
            Historial Clínico Completo ({filteredHistorias.length} registros)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tratamiento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pieza
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Odontólogo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistorias.map((historia) => (
                <tr key={historia.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(historia.fecha).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-xs">
                          {historia.pacienteNombre[0]}{historia.pacienteApellido[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {historia.pacienteNombre} {historia.pacienteApellido}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {historia.dni}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-semibold text-gray-800">{historia.tratamiento}</p>
                    <p className="text-xs text-gray-500 mt-1">{historia.descripcion}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {historia.pieza ? (
                      <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">
                        {historia.pieza}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {historia.odontologo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    S/ {historia.costo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      historia.estado === 'Completado' ? 'bg-green-100 text-green-700' :
                      historia.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {historia.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => verDetallePaciente(historia.pacienteId)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Ver paciente"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sin resultados */}
        {filteredHistorias.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No se encontraron historias clínicas</p>
            <p className="text-gray-500 text-sm mt-1">Intenta con otros criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}