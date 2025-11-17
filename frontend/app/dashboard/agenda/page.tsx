'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Cita {
  id: number
  pacienteId: number
  pacienteNombre: string
  pacienteTelefono?: string
  odontologoId: number
  odontologoNombre: string
  fecha: string
  horaInicio: string
  horaFin: string
  tratamiento: string
  especialidad?: string
  sede?: string
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Completada'
  motivoConsulta?: string
  observacion?: string
  notas?: string
}

interface Odontologo {
  id: number
  nombre: string
  color: string
}

export default function AgendaPage() {
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedOdontologo, setSelectedOdontologo] = useState<number>(0)
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [hoveredCita, setHoveredCita] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null)

  const odontologos: Odontologo[] = [
    { id: 1, nombre: 'Dra. Rosa Sánchez', color: 'bg-pink-500' },
    { id: 2, nombre: 'Dra. Ana Rimac', color: 'bg-purple-500' },
    { id: 3, nombre: 'Dr. Jenny Villanueva', color: 'bg-green-500' },
    { id: 4, nombre: 'Dra. Aitana Quiroz', color: 'bg-pink-400' },
    { id: 5, nombre: 'Dr. Nicolás Marinas', color: 'bg-yellow-500' },
    { id: 6, nombre: 'Dra. Machuria Santiago', color: 'bg-orange-500' },
  ]

  const today = new Date().toISOString().split('T')[0]

  const [citas, setCitas] = useState<Cita[]>([
    {
      id: 1,
      pacienteId: 1,
      pacienteNombre: 'ROSA AS ALEXANDER SÁNCHEZ',
      odontologoId: 1,
      odontologoNombre: 'Dra. Rosa Sánchez',
      fecha: today,
      horaInicio: '09:00',
      horaFin: '09:30',
      tratamiento: 'GUTIERREZ',
      estado: 'Confirmada',
      sede: 'Lima Centro',
      especialidad: 'Ortodoncia'
    },
    {
      id: 2,
      pacienteId: 2,
      pacienteNombre: 'ANA BEATRIZ ASENCIOS RIMAC',
      odontologoId: 2,
      odontologoNombre: 'Dra. Ana Rimac',
      fecha: today,
      horaInicio: '09:30',
      horaFin: '10:00',
      tratamiento: 'Control',
      estado: 'Pendiente',
      sede: 'San Isidro'
    },
    {
      id: 3,
      pacienteId: 3,
      pacienteNombre: 'JENNY PAUL ROMERO VILLANUEVA',
      odontologoId: 3,
      odontologoNombre: 'Dr. Jenny Villanueva',
      fecha: today,
      horaInicio: '10:00',
      horaFin: '11:00',
      tratamiento: 'Ortodoncia',
      estado: 'Confirmada',
      sede: 'Miraflores'
    },
    {
      id: 4,
      pacienteId: 4,
      pacienteNombre: 'AITANA ALESSANDRA TOVERA QUIROZ',
      odontologoId: 4,
      odontologoNombre: 'Dra. Aitana Quiroz',
      fecha: today,
      horaInicio: '11:30',
      horaFin: '12:00',
      tratamiento: 'Limpieza dental',
      estado: 'Confirmada',
      sede: 'San Borja'
    },
    {
      id: 5,
      pacienteId: 5,
      pacienteNombre: 'NICOLÁS DEL PILAR COLLANTES MARINAS',
      odontologoId: 5,
      odontologoNombre: 'Dr. Nicolás Marinas',
      fecha: today,
      horaInicio: '09:00',
      horaFin: '10:00',
      tratamiento: 'Endodoncia',
      estado: 'Confirmada',
      sede: 'Surco'
    },
    {
      id: 6,
      pacienteId: 6,
      pacienteNombre: 'ROSA MACHURIA DIAZ SANTIAGO',
      odontologoId: 6,
      odontologoNombre: 'Dra. Machuria Santiago',
      fecha: today,
      horaInicio: '11:30',
      horaFin: '12:00',
      tratamiento: 'Consulta',
      estado: 'Pendiente',
      sede: 'Lima Centro'
    },
  ])

  const [formData, setFormData] = useState({
    pacienteNombre: '',
    odontologoId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    tratamiento: '',
    notas: ''
  })

  const horas = []
  for (let h = 8; h <= 20; h++) {
    horas.push(`${h.toString().padStart(2, '0')}:00`)
  }

  const getWeekDays = (date: Date) => {
    const days = []
    const current = new Date(date)
    const dayOfWeek = current.getDay()
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    current.setDate(diff)
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }

  const weekDays = getWeekDays(selectedDate)

  const filteredCitas = citas.filter(cita => {
    if (selectedOdontologo && cita.odontologoId !== selectedOdontologo) return false
    return true
  })

  const cambiarPeriodo = (direccion: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direccion === 'next' ? 1 : -1))
    } else {
      newDate.setDate(newDate.getDate() + (direccion === 'next' ? 7 : -7))
    }
    setSelectedDate(newDate)
  }

  const getTimePosition = (hora: string) => {
    const [h, m] = hora.split(':').map(Number)
    const minutes = (h - 8) * 60 + m
    return (minutes / 60) * 60 // 60px por hora
  }

  const getCitaHeight = (horaInicio: string, horaFin: string) => {
    const [hI, mI] = horaInicio.split(':').map(Number)
    const [hF, mF] = horaFin.split(':').map(Number)
    const minutes = (hF * 60 + mF) - (hI * 60 + mI)
    return (minutes / 60) * 60 // 60px por hora
  }

  const handleCitaClick = (cita: Cita) => {
    setSelectedCita(cita)
    setShowDetailModal(true)
    setHoveredCita(null)
  }

  const handleMouseMove = (e: React.MouseEvent, citaId: number) => {
    setHoveredCita(citaId)
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const getEstadoBadge = (estado: string) => {
    const styles = {
      'Confirmada': 'bg-green-500 text-white',
      'Pendiente': 'bg-yellow-400 text-gray-800',
      'Cancelada': 'bg-red-500 text-white',
      'Completada': 'bg-blue-500 text-white'
    }
    return styles[estado as keyof typeof styles] || 'bg-gray-400 text-white'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => cambiarPeriodo('prev')}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ‹
            </button>
            
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {viewMode === 'day' 
                  ? selectedDate.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : selectedDate.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
                }
              </h2>
              {viewMode === 'week' && (
                <p className="text-sm text-gray-600">
                  {weekDays[0].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                </p>
              )}
            </div>

            <button
              onClick={() => cambiarPeriodo('next')}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ›
            </button>

            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Hoy
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Vista */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                Semana
              </button>
            </div>

            <select
              value={selectedOdontologo}
              onChange={(e) => setSelectedOdontologo(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="0">Todos</option>
              {odontologos.map(od => (
                <option key={od.id} value={od.id}>{od.nombre}</option>
              ))}
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              + Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className={viewMode === 'day' ? 'min-w-[600px]' : 'min-w-[1400px]'}>
            {/* Header */}
            <div className={`grid ${viewMode === 'day' ? 'grid-cols-2' : 'grid-cols-8'} bg-gray-50 border-b`}>
              <div className="p-3 text-xs font-semibold text-gray-600 border-r">HORA</div>
              {viewMode === 'day' ? (
                <div className="p-3 text-center">
                  <p className="text-xs text-gray-500 uppercase">
                    {selectedDate.toLocaleDateString('es-PE', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-bold text-gray-800">{selectedDate.getDate()}</p>
                </div>
              ) : (
                weekDays.map((day, idx) => {
                  const isToday = day.toDateString() === new Date().toDateString()
                  return (
                    <div key={idx} className={`p-3 text-center border-r ${isToday ? 'bg-blue-50' : ''}`}>
                      <p className="text-xs text-gray-500 uppercase">
                        {day.toLocaleDateString('es-PE', { weekday: 'short' })}
                      </p>
                      <p className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                        {day.getDate()}
                      </p>
                    </div>
                  )
                })
              )}
            </div>

            {/* Grid */}
            <div className="relative">
              {horas.map((hora) => (
                <div key={hora} className={`grid ${viewMode === 'day' ? 'grid-cols-2' : 'grid-cols-8'} border-b`} style={{ height: '60px' }}>
                  <div className="p-2 text-xs text-gray-500 border-r">{hora}</div>
                  {viewMode === 'day' ? (
                    <div className="relative border-r"></div>
                  ) : (
                    weekDays.map((_, idx) => (
                      <div key={idx} className="relative border-r"></div>
                    ))
                  )}
                </div>
              ))}

              {/* Citas superpuestas */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`grid ${viewMode === 'day' ? 'grid-cols-2' : 'grid-cols-8'} h-full`}>
                  <div className="border-r"></div>
                  {viewMode === 'day' ? (
                    <div className="relative pointer-events-auto">
                      {filteredCitas
                        .filter(c => c.fecha === selectedDate.toISOString().split('T')[0])
                        .map((cita) => {
                          const odontologo = odontologos.find(o => o.id === cita.odontologoId)
                          const top = getTimePosition(cita.horaInicio)
                          const height = getCitaHeight(cita.horaInicio, cita.horaFin)
                          
                          return (
                            <div
                              key={cita.id}
                              className={`absolute left-1 right-1 ${odontologo?.color} rounded-lg p-2 cursor-pointer shadow-md hover:shadow-xl transition-shadow`}
                              style={{ top: `${top}px`, height: `${height}px` }}
                              onClick={() => handleCitaClick(cita)}
                              onMouseMove={(e) => handleMouseMove(e, cita.id)}
                              onMouseLeave={() => setHoveredCita(null)}
                            >
                              <div className="flex flex-col justify-between h-full">
                                <div>
                                  <p className="text-white text-xs font-semibold">
                                    {cita.horaInicio} - {cita.horaFin}
                                  </p>
                                  <p className="text-white text-sm font-bold leading-tight mt-1">
                                    {cita.pacienteNombre}
                                  </p>
                                  {height > 60 && (
                                    <p className="text-white text-xs mt-1 opacity-90">
                                      {cita.tratamiento}
                                    </p>
                                  )}
                                </div>
                                {height > 80 && (
                                  <span className={`text-xs px-2 py-1 rounded ${getEstadoBadge(cita.estado)} inline-block self-start`}>
                                    {cita.estado}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    weekDays.map((day, dayIdx) => {
                      const fechaStr = day.toISOString().split('T')[0]
                      return (
                        <div key={dayIdx} className="relative pointer-events-auto border-r">
                          {filteredCitas
                            .filter(c => c.fecha === fechaStr)
                            .map((cita) => {
                              const odontologo = odontologos.find(o => o.id === cita.odontologoId)
                              const top = getTimePosition(cita.horaInicio)
                              const height = getCitaHeight(cita.horaInicio, cita.horaFin)
                              
                              return (
                                <div
                                  key={cita.id}
                                  className={`absolute left-1 right-1 ${odontologo?.color} rounded-lg p-2 cursor-pointer shadow-md hover:shadow-xl transition-shadow`}
                                  style={{ top: `${top}px`, height: `${height}px` }}
                                  onClick={() => handleCitaClick(cita)}
                                  onMouseMove={(e) => handleMouseMove(e, cita.id)}
                                  onMouseLeave={() => setHoveredCita(null)}
                                >
                                  <div className="flex flex-col justify-between h-full">
                                    <div>
                                      <p className="text-white text-xs font-semibold">
                                        {cita.horaInicio} - {cita.horaFin}
                                      </p>
                                      <p className="text-white text-sm font-bold leading-tight mt-1">
                                        {cita.pacienteNombre}
                                      </p>
                                      {height > 60 && (
                                        <p className="text-white text-xs mt-1 opacity-90">
                                          {cita.tratamiento}
                                        </p>
                                      )}
                                    </div>
                                    {height > 80 && (
                                      <span className={`text-xs px-2 py-1 rounded ${getEstadoBadge(cita.estado)} inline-block self-start`}>
                                        {cita.estado}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip Hover */}
      {hoveredCita && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 pointer-events-none"
          style={{
            left: `${mousePosition.x + 15}px`,
            top: `${mousePosition.y + 15}px`,
            maxWidth: '280px'
          }}
        >
          {(() => {
            const cita = citas.find(c => c.id === hoveredCita)
            if (!cita) return null
            return (
              <div className="space-y-2 text-sm">
                <p className="font-bold text-gray-800">{cita.pacienteNombre}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Hora:</p>
                    <p className="font-semibold">{cita.horaInicio} - {cita.horaFin}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Médico:</p>
                    <p className="font-semibold">{cita.odontologoNombre}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Tratamiento:</p>
                    <p className="font-semibold">{cita.tratamiento}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getEstadoBadge(cita.estado)} inline-block`}>
                  {cita.estado}
                </span>
              </div>
            )
          })()}
        </div>
      )}

      {/* Modal Detalle Completo */}
      {showDetailModal && selectedCita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">📅 Editar Cita</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedCita(null)
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getEstadoBadge(selectedCita.estado)}`}>
                  {selectedCita.estado}
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                    Confirmar
                  </button>
                  <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Paciente</p>
                <p className="text-xl font-bold text-gray-800">{selectedCita.pacienteNombre}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Médico</p>
                  <p className="font-semibold">{selectedCita.odontologoNombre}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Tratamiento</p>
                  <p className="font-semibold">{selectedCita.tratamiento}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Fecha</p>
                  <p className="font-semibold">{new Date(selectedCita.fecha).toLocaleDateString('es-PE')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Horario</p>
                  <p className="font-semibold">{selectedCita.horaInicio} - {selectedCita.horaFin}</p>
                </div>
                {selectedCita.sede && (
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Sede</p>
                    <p className="font-semibold">{selectedCita.sede}</p>
                  </div>
                )}
              </div>

              {selectedCita.notas && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Observaciones</p>
                  <p className="text-gray-700">{selectedCita.notas}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  Editar
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                  WhatsApp
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Cita */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold">Nueva Cita</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Formulario de nueva cita aquí...</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}