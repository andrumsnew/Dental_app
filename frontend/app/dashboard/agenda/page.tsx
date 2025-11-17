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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newCita: Cita = {
      id: citas.length + 1,
      pacienteId: 0,
      pacienteNombre: formData.pacienteNombre,
      odontologoId: parseInt(formData.odontologoId),
      odontologoNombre: odontologos.find(o => o.id === parseInt(formData.odontologoId))?.nombre || '',
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      tratamiento: formData.tratamiento,
      estado: 'Pendiente',
      notas: formData.notas
    }

    setCitas([...citas, newCita])
    setSelectedDate(new Date(formData.fecha))
    
    setShowModal(false)
    setFormData({
      pacienteNombre: '',
      odontologoId: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      tratamiento: '',
      notas: ''
    })
    
    alert('¡Cita creada exitosamente!')
  }

  const handleConfirmarCita = () => {
    if (!selectedCita) return
    
    setCitas(citas.map(c => 
      c.id === selectedCita.id 
        ? { ...c, estado: 'Confirmada' }
        : c
    ))
    setSelectedCita({ ...selectedCita, estado: 'Confirmada' })
  }

  const handleCancelarCita = () => {
    if (!selectedCita) return
    
    setCitas(citas.map(c => 
      c.id === selectedCita.id 
        ? { ...c, estado: 'Cancelada' }
        : c
    ))
    setSelectedCita({ ...selectedCita, estado: 'Cancelada' })
  }

  const handleEliminarCita = () => {
    if (!selectedCita) return
    
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      setCitas(citas.filter(c => c.id !== selectedCita.id))
      setShowDetailModal(false)
      setSelectedCita(null)
    }
  }

  const handleEditarCita = () => {
    alert('Función de edición en desarrollo. Aquí podrías abrir un formulario de edición.')
  }

  const horas = []
  for (let h = 8; h <= 20; h++) {
    horas.push(`${h.toString().padStart(2, '0')}:00`)
  }
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
                              className={`absolute left-2 right-2 ${odontologo?.color} rounded-lg p-3 cursor-pointer shadow-lg hover:shadow-xl transition-all overflow-hidden`}
                              style={{ top: `${top}px`, height: `${height}px`, minHeight: '60px' }}
                              onClick={() => handleCitaClick(cita)}
                              onMouseMove={(e) => handleMouseMove(e, cita.id)}
                              onMouseLeave={() => setHoveredCita(null)}
                            >
                              <div className="flex flex-col h-full gap-1">
                                <p className="text-white text-xs font-bold leading-tight">
                                  {cita.horaInicio} - {cita.horaFin}
                                </p>
                                <p className="text-white text-sm font-bold leading-tight line-clamp-2">
                                  {cita.pacienteNombre}
                                </p>
                                {height > 70 && (
                                  <p className="text-white text-xs opacity-90 leading-tight">
                                    {cita.tratamiento}
                                  </p>
                                )}
                                {height > 90 && (
                                  <span className={`text-xs px-2 py-1 rounded font-medium ${getEstadoBadge(cita.estado)} inline-block self-start mt-auto`}>
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
                                  className={`absolute left-2 right-2 ${odontologo?.color} rounded-lg p-3 cursor-pointer shadow-lg hover:shadow-xl transition-all overflow-hidden`}
                                  style={{ top: `${top}px`, height: `${height}px`, minHeight: '60px' }}
                                  onClick={() => handleCitaClick(cita)}
                                  onMouseMove={(e) => handleMouseMove(e, cita.id)}
                                  onMouseLeave={() => setHoveredCita(null)}
                                >
                                  <div className="flex flex-col h-full gap-1">
                                    <p className="text-white text-xs font-bold leading-tight">
                                      {cita.horaInicio} - {cita.horaFin}
                                    </p>
                                    <p className="text-white text-sm font-bold leading-tight line-clamp-2">
                                      {cita.pacienteNombre}
                                    </p>
                                    {height > 70 && (
                                      <p className="text-white text-xs opacity-90 leading-tight">
                                        {cita.tratamiento}
                                      </p>
                                    )}
                                    {height > 90 && (
                                      <span className={`text-xs px-2 py-1 rounded font-medium ${getEstadoBadge(cita.estado)} inline-block self-start mt-auto`}>
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-bold">Editar Cita</h2>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedCita(null)
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Estado y acciones */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getEstadoBadge(selectedCita.estado)}`}>
                  {selectedCita.estado}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleConfirmarCita}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors"
                  >
                    ✓ Confirmar
                  </button>
                  <button 
                    onClick={handleCancelarCita}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </div>

              {/* Información del paciente */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Paciente
                </p>
                <p className="text-2xl font-bold text-gray-800">{selectedCita.pacienteNombre}</p>
              </div>

              {/* Información de la cita en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Odontólogo</p>
                  <p className="text-lg font-bold text-gray-800">{selectedCita.odontologoNombre}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Tratamiento</p>
                  <p className="text-lg font-bold text-gray-800">{selectedCita.tratamiento}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Fecha</p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(selectedCita.fecha).toLocaleDateString('es-PE', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Horario</p>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedCita.horaInicio} - {selectedCita.horaFin}
                  </p>
                </div>
                
                {selectedCita.sede && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Sede</p>
                    <p className="text-lg font-bold text-gray-800">{selectedCita.sede}</p>
                  </div>
                )}
              </div>

              {/* Notas adicionales */}
              {selectedCita.notas && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Observaciones
                  </p>
                  <p className="text-gray-700">{selectedCita.notas}</p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-5 border-t">
                <button 
                  onClick={handleEditarCita}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                
                <button 
                  onClick={() => {
                    if (selectedCita?.pacienteTelefono) {
                      const mensaje = `Hola ${selectedCita.pacienteNombre}, recordatorio de cita: ${selectedCita.tratamiento} - ${new Date(selectedCita.fecha).toLocaleDateString('es-PE')} ${selectedCita.horaInicio}`
                      window.open(`https://wa.me/51${selectedCita.pacienteTelefono}?text=${encodeURIComponent(mensaje)}`, '_blank')
                    } else {
                      alert('Este paciente no tiene número de teléfono registrado')
                    }
                  }}
                  className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                
                <button 
                  onClick={handleEliminarCita}
                  className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg sticky top-0">
              <h2 className="text-xl font-bold">Nueva Cita</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paciente *
                  </label>
                  <input
                    type="text"
                    value={formData.pacienteNombre}
                    onChange={(e) => setFormData({...formData, pacienteNombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nombre del paciente"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Odontólogo *
                  </label>
                  <select
                    value={formData.odontologoId}
                    onChange={(e) => setFormData({...formData, odontologoId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Seleccionar odontólogo</option>
                    {odontologos.map(odontologo => (
                      <option key={odontologo.id} value={odontologo.id}>
                        {odontologo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora inicio *
                  </label>
                  <input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora fin *
                  </label>
                  <input
                    type="time"
                    value={formData.horaFin}
                    onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento *
                </label>
                <input
                  type="text"
                  value={formData.tratamiento}
                  onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: Limpieza dental, Extracción, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  rows={3}
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Información adicional sobre la cita..."
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}