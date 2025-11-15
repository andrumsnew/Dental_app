'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Cita {
  id: number
  fecha: string
  hora: string
  tratamiento: string
  odontologo: string
  estado: string
  notas?: string
}

interface Tratamiento {
  id: number
  fecha: string
  pieza?: string
  tratamiento: string
  descripcion: string
  costo: number
  odontologo: string
}

interface Imagen {
  id: number
  tipo: 'Radiografía' | 'Foto intraoral' | 'Foto extraoral' | 'Otro'
  fecha: string
  url: string
  notas?: string
}

export default function PacienteDetallePage() {
  const params = useParams()
  const router = useRouter()
  const pacienteId = params.id

  const [activeTab, setActiveTab] = useState<'info' | 'citas' | 'historial' | 'imagenes' | 'odontograma'>('info')
  const [showModalTratamiento, setShowModalTratamiento] = useState(false)
  const [formTratamiento, setFormTratamiento] = useState({
    pieza: '',
    tratamiento: '',
    descripcion: '',
    costo: '',
    odontologo: ''
  })

  // Datos de ejemplo del paciente (luego vendrá del backend)
  const paciente = {
    id: pacienteId,
    nombre: 'María',
    apellido: 'García López',
    dni: '45678912',
    fechaNacimiento: '1985-03-15',
    telefono: '987654321',
    email: 'maria.garcia@email.com',
    direccion: 'Av. Principal 123, San Isidro, Lima',
    estado: 'Activo',
    ultimaVisita: '2024-11-10',
    alergias: 'Penicilina',
    enfermedades: 'Hipertensión controlada',
    medicamentos: 'Losartán 50mg',
    observaciones: 'Paciente nerviosa, requiere anestesia extra'
  }

  const citas: Cita[] = [
    { id: 1, fecha: '2024-11-20', hora: '10:00', tratamiento: 'Limpieza dental', odontologo: 'Dr. García', estado: 'Confirmada' },
    { id: 2, fecha: '2024-11-10', hora: '14:00', tratamiento: 'Revisión general', odontologo: 'Dr. García', estado: 'Completada', notas: 'Todo en orden' },
    { id: 3, fecha: '2024-10-15', hora: '09:30', tratamiento: 'Extracción pieza 28', odontologo: 'Dra. Rodríguez', estado: 'Completada' },
  ]

  const [historialClinico, setHistorialClinico] = useState<Tratamiento[]>([
    { id: 1, fecha: '2024-10-15', pieza: '28', tratamiento: 'Extracción', descripcion: 'Extracción de muela del juicio superior derecha', costo: 250, odontologo: 'Dra. Rodríguez' },
    { id: 2, fecha: '2024-09-20', pieza: '16', tratamiento: 'Obturación', descripcion: 'Caries oclusal, obturación con resina', costo: 150, odontologo: 'Dr. García' },
    { id: 3, fecha: '2024-08-10', pieza: '36', tratamiento: 'Endodoncia', descripcion: 'Tratamiento de conducto + corona', costo: 800, odontologo: 'Dr. Martínez' },
  ])

  const handleAgregarTratamiento = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nuevoTratamiento: Tratamiento = {
      id: historialClinico.length + 1,
      fecha: new Date().toISOString().split('T')[0],
      pieza: formTratamiento.pieza,
      tratamiento: formTratamiento.tratamiento,
      descripcion: formTratamiento.descripcion,
      costo: parseFloat(formTratamiento.costo),
      odontologo: formTratamiento.odontologo
    }

    setHistorialClinico([nuevoTratamiento, ...historialClinico])
    setShowModalTratamiento(false)
    setFormTratamiento({
      pieza: '',
      tratamiento: '',
      descripcion: '',
      costo: '',
      odontologo: ''
    })
  }

  const imagenes: Imagen[] = [
    { id: 1, tipo: 'Radiografía', fecha: '2024-11-10', url: 'https://placehold.co/400x300/e0e0e0/666?text=Radiografia+Panoramica', notas: 'Panorámica de control' },
    { id: 2, tipo: 'Foto intraoral', fecha: '2024-10-15', url: 'https://placehold.co/400x300/e0e0e0/666?text=Foto+Intraoral', notas: 'Antes de extracción' },
    { id: 3, tipo: 'Radiografía', fecha: '2024-09-20', url: 'https://placehold.co/400x300/e0e0e0/666?text=Radiografia+Periapical', notas: 'Pieza 16' },
  ]

  // Odontograma simplificado (32 dientes adulto)
  const dientes = [
    // Superior derecho (18-11)
    { num: 18, estado: 'sano' }, { num: 17, estado: 'sano' }, { num: 16, estado: 'obturado' }, 
    { num: 15, estado: 'sano' }, { num: 14, estado: 'sano' }, { num: 13, estado: 'sano' }, 
    { num: 12, estado: 'sano' }, { num: 11, estado: 'sano' },
    // Superior izquierdo (21-28)
    { num: 21, estado: 'sano' }, { num: 22, estado: 'sano' }, { num: 23, estado: 'sano' }, 
    { num: 24, estado: 'sano' }, { num: 25, estado: 'sano' }, { num: 26, estado: 'corona' }, 
    { num: 27, estado: 'sano' }, { num: 28, estado: 'ausente' },
    // Inferior izquierdo (38-31)
    { num: 38, estado: 'sano' }, { num: 37, estado: 'sano' }, { num: 36, estado: 'endodoncia' }, 
    { num: 35, estado: 'sano' }, { num: 34, estado: 'sano' }, { num: 33, estado: 'sano' }, 
    { num: 32, estado: 'sano' }, { num: 31, estado: 'sano' },
    // Inferior derecho (41-48)
    { num: 41, estado: 'sano' }, { num: 42, estado: 'sano' }, { num: 43, estado: 'sano' }, 
    { num: 44, estado: 'sano' }, { num: 45, estado: 'sano' }, { num: 46, estado: 'caries' }, 
    { num: 47, estado: 'sano' }, { num: 48, estado: 'sano' },
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'sano': return 'bg-white border-2 border-green-500'
      case 'caries': return 'bg-red-500'
      case 'obturado': return 'bg-blue-500'
      case 'endodoncia': return 'bg-purple-500'
      case 'corona': return 'bg-yellow-500'
      case 'ausente': return 'bg-gray-300 opacity-50'
      default: return 'bg-white border-2 border-gray-300'
    }
  }

  const calcularEdad = () => {
    const hoy = new Date()
    const nacimiento = new Date(paciente.fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  return (
    <div className="space-y-6">
      {/* Header con info del paciente */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold">
                {paciente.nombre[0]}{paciente.apellido[0]}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold">{paciente.nombre} {paciente.apellido}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {paciente.telefono}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {paciente.email}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {calcularEdad()} años
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
              paciente.estado === 'Activo' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              {paciente.estado}
            </span>
            <p className="text-sm mt-2 opacity-90">DNI: {paciente.dni}</p>
            <p className="text-xs mt-1 opacity-75">Última visita: {new Date(paciente.ultimaVisita).toLocaleDateString('es-PE')}</p>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'info', name: 'Información', icon: '👤' },
            { id: 'citas', name: 'Citas', icon: '📅' },
            { id: 'historial', name: 'Historial Clínico', icon: '📋' },
            { id: 'imagenes', name: 'Imágenes', icon: '📷' },
            { id: 'odontograma', name: 'Odontograma', icon: '🦷' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Contenido de tabs */}
        <div className="p-6">
          {/* Tab: Información */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Datos Personales</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Nombre completo:</span> <span className="font-semibold text-gray-800">{paciente.nombre} {paciente.apellido}</span></p>
                    <p><span className="text-gray-600">DNI:</span> <span className="font-semibold text-gray-800">{paciente.dni}</span></p>
                    <p><span className="text-gray-600">Fecha de nacimiento:</span> <span className="font-semibold text-gray-800">{new Date(paciente.fechaNacimiento).toLocaleDateString('es-PE')}</span></p>
                    <p><span className="text-gray-600">Edad:</span> <span className="font-semibold text-gray-800">{calcularEdad()} años</span></p>
                    <p><span className="text-gray-600">Dirección:</span> <span className="font-semibold text-gray-800">{paciente.direccion}</span></p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Contacto</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Teléfono:</span> <span className="font-semibold text-gray-800">{paciente.telefono}</span></p>
                    <p><span className="text-gray-600">Email:</span> <span className="font-semibold text-gray-800">{paciente.email}</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Información Médica Importante
                </h3>
                <div className="space-y-2">
                  <p><span className="text-red-700 font-semibold">Alergias:</span> {paciente.alergias}</p>
                  <p><span className="text-red-700 font-semibold">Enfermedades:</span> {paciente.enfermedades}</p>
                  <p><span className="text-red-700 font-semibold">Medicamentos:</span> {paciente.medicamentos}</p>
                </div>
              </div>

              {paciente.observaciones && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-yellow-800 mb-2">Observaciones</h3>
                  <p className="text-gray-700">{paciente.observaciones}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Citas */}
          {activeTab === 'citas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Historial de Citas ({citas.length})</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  + Nueva Cita
                </button>
              </div>

              {citas.map((cita) => (
                <div key={cita.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{new Date(cita.fecha).getDate()}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(cita.fecha).toLocaleDateString('es-PE', { month: 'short' })}
                        </p>
                      </div>
                      <div className="h-12 w-1 bg-indigo-600 rounded"></div>
                      <div>
                        <p className="font-semibold text-gray-800">{cita.tratamiento}</p>
                        <p className="text-sm text-gray-600">Dr. {cita.odontologo} • {cita.hora}</p>
                        {cita.notas && <p className="text-xs text-gray-500 mt-1">📝 {cita.notas}</p>}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cita.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                      cita.estado === 'Confirmada' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {cita.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Historial Clínico */}
          {activeTab === 'historial' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Tratamientos Realizados ({historialClinico.length})</h3>
                  <p className="text-sm text-gray-600 mt-1">Historial completo de procedimientos</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total invertido</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      S/ {historialClinico.reduce((sum, t) => sum + t.costo, 0).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModalTratamiento(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar Tratamiento
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pieza</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tratamiento</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descripción</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Odontólogo</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Costo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historialClinico.map((tratamiento) => (
                      <tr key={tratamiento.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(tratamiento.fecha).toLocaleDateString('es-PE')}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-bold">
                            {tratamiento.pieza || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{tratamiento.tratamiento}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{tratamiento.descripcion}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{tratamiento.odontologo}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">S/ {tratamiento.costo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Imágenes */}
          {activeTab === 'imagenes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Imágenes y Radiografías ({imagenes.length})</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  + Subir Imagen
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imagenes.map((imagen) => (
                  <div key={imagen.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={imagen.url} alt={imagen.tipo} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {imagen.tipo}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(imagen.fecha).toLocaleDateString('es-PE')}</span>
                      </div>
                      {imagen.notas && <p className="text-sm text-gray-600 mt-2">{imagen.notas}</p>}
                      <button className="mt-3 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                        Ver completo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Odontograma */}
          {activeTab === 'odontograma' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Odontograma</h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-green-500 rounded"></div>
                    <span>Sano</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Caries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Obturado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span>Endodoncia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Corona</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Ausente</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                {/* Superior */}
                <div className="mb-8">
                  <p className="text-center text-sm font-semibold text-gray-600 mb-4">SUPERIOR</p>
                  <div className="flex justify-center gap-2">
                    {dientes.slice(0, 16).map((diente) => (
                      <div key={diente.num} className="text-center">
                        <div className={`w-10 h-10 ${getEstadoColor(diente.estado)} rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-all`}>
                          <span className="text-xs font-bold text-gray-700">{diente.num}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Línea divisoria */}
                <div className="border-t-2 border-gray-300 my-4"></div>

                {/* Inferior */}
                <div>
                  <div className="flex justify-center gap-2">
                    {dientes.slice(16, 32).map((diente) => (
                      <div key={diente.num} className="text-center">
                        <div className={`w-10 h-10 ${getEstadoColor(diente.estado)} rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-all`}>
                          <span className="text-xs font-bold text-gray-700">{diente.num}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm font-semibold text-gray-600 mt-4">INFERIOR</p>
                </div>
              </div>

              {/* Notas del odontograma */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Notas del Odontograma</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Pieza 16: Obturación en buen estado</li>
                  <li>• Pieza 26: Corona instalada hace 2 años</li>
                  <li>• Pieza 28: Extraída en octubre 2024</li>
                  <li>• Pieza 36: Endodoncia completada, requiere control</li>
                  <li>• Pieza 46: Caries detectada, programar tratamiento</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar tratamiento al historial */}
      {showModalTratamiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Agregar Tratamiento</h2>
                <p className="text-sm opacity-90 mt-1">Paciente: {paciente.nombre} {paciente.apellido}</p>
              </div>
              <button
                onClick={() => {
                  setShowModalTratamiento(false)
                  setFormTratamiento({
                    pieza: '',
                    tratamiento: '',
                    descripcion: '',
                    costo: '',
                    odontologo: ''
                  })
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAgregarTratamiento} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pieza Dental
                  </label>
                  <input
                    type="text"
                    value={formTratamiento.pieza}
                    onChange={(e) => setFormTratamiento({...formTratamiento, pieza: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Ej: 16, 28, 36..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Opcional - Deja vacío si no aplica</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Odontólogo *
                  </label>
                  <select
                    value={formTratamiento.odontologo}
                    onChange={(e) => setFormTratamiento({...formTratamiento, odontologo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="Dr. García">Dr. García</option>
                    <option value="Dra. Rodríguez">Dra. Rodríguez</option>
                    <option value="Dr. Martínez">Dr. Martínez</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento Realizado *
                </label>
                <input
                  type="text"
                  value={formTratamiento.tratamiento}
                  onChange={(e) => setFormTratamiento({...formTratamiento, tratamiento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ej: Limpieza dental, Extracción, Obturación..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Detallada *
                </label>
                <textarea
                  rows={3}
                  value={formTratamiento.descripcion}
                  onChange={(e) => setFormTratamiento({...formTratamiento, descripcion: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe el procedimiento realizado..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo (S/) *
                </label>
                <input
                  type="number"
                  value={formTratamiento.costo}
                  onChange={(e) => setFormTratamiento({...formTratamiento, costo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="150"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-blue-800 mb-1">Nota:</p>
                    <p>Este tratamiento se registrará con la fecha de hoy. Se agregará al historial clínico del paciente y podrá ser facturado posteriormente.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModalTratamiento(false)
                    setFormTratamiento({
                      pieza: '',
                      tratamiento: '',
                      descripcion: '',
                      costo: '',
                      odontologo: ''
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
                  Guardar Tratamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}