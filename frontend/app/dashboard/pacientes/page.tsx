'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Patient {
  id: number
  nombre: string
  apellido: string
  dni: string
  telefono: string
  email: string
  fechaNacimiento: string
  ultimaVisita: string
  estado: 'Activo' | 'Inactivo'
  direccion?: string
  observaciones?: string
}

export default function PacientesPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos')
  const [showModal, setShowModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  // Abrir modal si viene el parámetro ?nuevo=true
  useEffect(() => {
    if (searchParams.get('nuevo') === 'true') {
      setShowModal(true)
    }
  }, [searchParams])

  const [pacientes, setPacientes] = useState<Patient[]>([
    {
      id: 1,
      nombre: 'María',
      apellido: 'García López',
      dni: '45678912',
      telefono: '987654321',
      email: 'maria.garcia@email.com',
      fechaNacimiento: '1985-03-15',
      ultimaVisita: '2024-11-10',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Juan',
      apellido: 'Pérez Torres',
      dni: '12345678',
      telefono: '987123456',
      email: 'juan.perez@email.com',
      fechaNacimiento: '1990-07-22',
      ultimaVisita: '2024-11-08',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Ana',
      apellido: 'Torres Ramos',
      dni: '78945612',
      telefono: '965874123',
      email: 'ana.torres@email.com',
      fechaNacimiento: '1978-12-03',
      ultimaVisita: '2024-10-25',
      estado: 'Activo'
    },
    {
      id: 4,
      nombre: 'Carlos',
      apellido: 'Ruiz Mendoza',
      dni: '98765432',
      telefono: '912345678',
      email: 'carlos.ruiz@email.com',
      fechaNacimiento: '1995-06-18',
      ultimaVisita: '2024-09-15',
      estado: 'Inactivo'
    },
    {
      id: 5,
      nombre: 'Lucía',
      apellido: 'Fernández Silva',
      dni: '65432198',
      telefono: '998877665',
      email: 'lucia.fernandez@email.com',
      fechaNacimiento: '1988-11-30',
      ultimaVisita: '2024-11-12',
      estado: 'Activo'
    },
  ])

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    observaciones: ''
  })

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Guardar nuevo paciente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPatient) {
      // Editar paciente existente
      setPacientes(pacientes.map(p => 
        p.id === editingPatient.id 
          ? { 
              ...p,
              nombre: formData.nombre,
              apellido: formData.apellido,
              dni: formData.dni,
              telefono: formData.telefono,
              email: formData.email,
              fechaNacimiento: formData.fechaNacimiento,
              direccion: formData.direccion,
              observaciones: formData.observaciones
            }
          : p
      ))
    } else {
      // Crear nuevo paciente
      const newPatient: Patient = {
        id: pacientes.length + 1,
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        telefono: formData.telefono,
        email: formData.email,
        fechaNacimiento: formData.fechaNacimiento,
        ultimaVisita: new Date().toISOString().split('T')[0],
        estado: 'Activo',
        direccion: formData.direccion,
        observaciones: formData.observaciones
      }
      setPacientes([...pacientes, newPatient])
    }

    // Cerrar modal y limpiar formulario
    setShowModal(false)
    setEditingPatient(null)
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      fechaNacimiento: '',
      telefono: '',
      email: '',
      direccion: '',
      observaciones: ''
    })
  }

  // Editar paciente
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      nombre: patient.nombre,
      apellido: patient.apellido,
      dni: patient.dni,
      fechaNacimiento: patient.fechaNacimiento,
      telefono: patient.telefono,
      email: patient.email,
      direccion: patient.direccion || '',
      observaciones: patient.observaciones || ''
    })
    setShowModal(true)
  }

  // Eliminar paciente
  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
      setPacientes(pacientes.filter(p => p.id !== id))
    }
  }

  // Filtrar pacientes
  const filteredPacientes = pacientes.filter(paciente => {
    const matchesSearch = 
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.dni.includes(searchTerm) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'Todos' || paciente.estado === filterStatus

    return matchesSearch && matchesStatus
  })

  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return 0
    
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    
    // Validar que la fecha sea válida
    if (isNaN(nacimiento.getTime())) return 0
    
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pacientes</p>
              <p className="text-3xl font-bold text-gray-800">{pacientes.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pacientes Activos</p>
              <p className="text-3xl font-bold text-green-600">
                {pacientes.filter(p => p.estado === 'Activo').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nuevos Este Mes</p>
              <p className="text-3xl font-bold text-indigo-600">8</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
                placeholder="Buscar por nombre, DNI o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Filtro de estado */}
          <div className="flex gap-2">
            {(['Todos', 'Activo', 'Inactivo'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Botón agregar */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Paciente
          </button>
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Edad
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Última Visita
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
              {filteredPacientes.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">
                          {paciente.nombre[0]}{paciente.apellido[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {paciente.nombre} {paciente.apellido}
                        </p>
                        <p className="text-sm text-gray-500">{paciente.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {paciente.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {paciente.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {calcularEdad(paciente.fechaNacimiento)} años
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(paciente.ultimaVisita).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      paciente.estado === 'Activo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {paciente.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => window.location.href = `/dashboard/pacientes/${paciente.id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEdit(paciente)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(paciente.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sin resultados */}
        {filteredPacientes.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 font-medium">No se encontraron pacientes</p>
            <p className="text-gray-500 text-sm mt-1">Intenta con otros criterios de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal para agregar paciente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingPatient(null)
                  setFormData({
                    nombre: '',
                    apellido: '',
                    dni: '',
                    fechaNacimiento: '',
                    telefono: '',
                    email: '',
                    direccion: '',
                    observaciones: ''
                  })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Datos personales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="María"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="García López"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI *
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    maxLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="12345678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="987654321"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="paciente@email.com"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Av. Principal 123, Lima"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones Médicas
                </label>
                <textarea
                  rows={3}
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Alergias, condiciones médicas, medicamentos..."
                ></textarea>
              </div>

              {/* Botones */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingPatient(null)
                    setFormData({
                      nombre: '',
                      apellido: '',
                      dni: '',
                      fechaNacimiento: '',
                      telefono: '',
                      email: '',
                      direccion: '',
                      observaciones: ''
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
                  {editingPatient ? 'Actualizar' : 'Guardar'} Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}