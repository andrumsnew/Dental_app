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
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Completada' | 'Confirmado por telefono'
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
  const [hoveredCita, setHoveredCita] = useState<number | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    if (searchParams.get('nueva') === 'true') {
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, fecha: today }))
      setShowModal(true)
    }
  }, [searchParams])

  const odontologos: Odontologo[] = [
    { id: 1, nombre: 'Dr. García', color: 'bg-pink-500' },
    { id: 2, nombre: 'Dra. Rodríguez', color: 'bg-blue-500' },
    { id: 3, nombre: 'Dr. Martínez', color: 'bg-green-500' },
    { id: 4, nombre: 'Dra. López', color: 'bg-purple-500' },
    { id: 5, nombre: 'Dr. Torres', color: 'bg-orange-500' },
    { id: 6, nombre: 'Dra. Ramírez', color: 'bg-teal-500' },
  ]

  const today = new Date().toISOString().split('T')[0]

  const [citas, setCitas] = useState<Cita[]>([
    {
      id: 1,
      pacienteId: 1,
      pacienteNombre: 'ROSA AS ALEXANDER SANCHEZ',
      odontologoId: 1,
      odontologoNombre: 'Dr. García',
      fecha: today,
      horaInicio: '09:00',
      horaFin: '09:30',
      tratamiento: 'GUTIERREZ',
      estado: 'Confirmada',
      sede: 'San Isidro'
    },
    {
      id: 2,
      pacienteId: 2,
      pacienteNombre: 'José Alejandro ALVAREZ TINEO',
      odontologoId: 2,
      odontologoNombre: 'Dra. Rodríguez',
      fecha: today,
      horaInicio: '10:00',
      horaFin: '10:30',
      tratamiento: 'Limpieza',
      estado: 'Pendiente',
      sede: 'Miraflores'
    },
    {
      id: 3,
      pacienteId: 3,
      pacienteNombre: 'JENNY PAUL ROMERO VILLANUEVA',
      odontologoId: 3,
      odontologoNombre: 'Dr. Martínez',
      fecha: today,
      horaInicio: '10:00',
      horaFin: '11:00',
      tratamiento: 'Ortodoncia',
      estado: 'Confirmada',
      sede: 'San Isidro'
    },
    {
      id: 4,
      pacienteId: 4,
      pacienteNombre: 'EDDIE HENRY TRUJILLO CUSITACANQUI',
      odontologoId: 4,
      odontologoNombre: 'Dra. López',
      fecha: today,
      horaInicio: '09:30',
      horaFin: '10:30',
      tratamiento: 'Control',
      estado: 'Confirmada',
      sede: 'Huacho'
    },
    {
      id: 5,
      pacienteId: 5,
      pacienteNombre: 'ANA BEATRIZ ASENCIOS RIMAC',
      odontologoId: 4,
      odontologoNombre: 'Dra. López',
      fecha: today,
      horaInicio: '09:30',
      horaFin: '10:00',
      tratamiento: 'Consulta',
      estado: 'Pendiente',
      sede: 'Lima'
    },
    {
      id: 6,
      pacienteId: 6,
      pacienteNombre: 'AITANA ALESSANDRA TOVERA QUIROZ',
      odontologoId: 1,
      odontologoNombre: 'Dr. García',
      fecha: today,
      horaInicio: '11:30',
      horaFin: '12:00',
      tratamiento: 'Endodoncia',
      estado: 'Confirmada',
      sede: 'San Borja'
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
    if (h < 20) {
      horas.push(`${h.toString().padStart(2, '0')}:30`)
    }
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

  const getCitasDelDia = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0]
    return filteredCitas.filter(cita => cita.fecha === fechaStr)
  }

  const cambiarSemana = (direccion: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direccion === 'next' ? 7 : -7))
    setSelectedDate(newDate)
  }

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
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
    
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
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Confirmada': return 'bg-green-500 text-white'
      case 'Pendiente': return 'bg-yellow-400 text-gray-800'
      case 'Cancelada': return 'bg-red-500 text-white'
      case 'Completada': return 'bg-blue-500 text-white'
      default: return 'bg-gray-400 text-white'
    }
  }

  const calculateCitaHeight = (horaInicio: string, horaFin: string) => {
    const [hI, mI] = horaInicio.split(':').map(Number)
    const [hF, mF] = horaFin.split(':').map(Number)
    const minutos = (hF * 60 + mF) - (hI * 60 + mI)
    return (minutos / 30) * 60 // 60px por cada 30 minutos
  }

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen p-4">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">¡Cita agendada exitosamente!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => cambiarSemana('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedDate.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-sm text-gray-600">
                {weekDays[0].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
              </p>
            </div>

            <button
              onClick={() => cambiarSemana('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Hoy
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedOdontologo}
              onChange={(e) => setSelectedOdontologo(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="0">Todos los odontólogos</option>
              {odontologos.map(odontologo => (
                <option key={odontologo.id} value={odontologo.id}>
                  {odontologo.nombre}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* Calendario semanal */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header días */}
            <div className="grid grid-cols-8 border-b bg-gray-50">
              <div className="p-3 text-xs font-semibold text-gray-600 border-r">HORA</div>
              {weekDays.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString()
                return (
                  <div
                    key={index}
                    className={`p-3 text-center border-r ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      {day.toLocaleDateString('es-PE', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                      {day.getDate()}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Grid horas */}
            <div className="relative">
              {horas.map((hora, horaIndex) => (
                <div key={hora} className="grid grid-cols-8 border-b" style={{ height: '60px' }}>
                  <div className="p-2 text-xs text-gray-500 font-medium border-r flex items-start">
                    {hora}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const fechaStr = day.toISOString().split('T')[0]
                    const citasDelDia = filteredCitas.filter(cita => cita.fecha === fechaStr)
                    
                    const citasEnHora = citasDelDia.filter(cita => {
                      const [h, m] = cita.horaInicio.split(':').map(Number)
                      const [hBloque, mBloque] = hora.split(':').map(Number)
                      return h === hBloque && m === mBloque
                    })
                    
                    return (
                      <div key={dayIndex} className="border-r relative hover:bg-gray-50">
                        {citasEnHora.map((cita) => {
                          const odontologo = odontologos.find(o => o.id === cita.odontologoId)
                          const height = calculateCitaHeight(cita.horaInicio, cita.horaFin)
                          const isHovered = hoveredCita === cita.id
                          
                          return (
                            <div
                              key={cita.id}
                              className="absolute left-0 right-0 mx-0.5 mt-0.5"
                              style={{ height: `${height}px` }}
                              onMouseEnter={() => setHoveredCita(cita.id)}
                              onMouseLeave={() => setHoveredCita(null)}
                            >
                              <div
                                onClick={() => {
                                  setSelectedCita(cita)
                                  setShowDetailModal(true)
                                }}
                                className={`${odontologo?.color} h-full rounded-md p-2 cursor-pointer transition-all ${
                                  isHovered ? 'shadow-xl scale-105 z-50' : 'shadow-sm'
                                }`}
                              >
                                <div className="flex flex-col h-full justify-between">
                                  <div>
                                    <p className="text-xs text-white font-semibold leading-tight">
                                      {cita.horaInicio} - {cita.horaFin}
                                    </p>
                                    <p className="text-xs text-white font-bold mt-1 leading-tight">
                                      {cita.pacienteNombre}
                                    </p>
                                    <p className="text-xs text-white opacity-90 mt-0.5">
                                      {cita.tratamiento}
                                    </p>
                                  </div>
                                  <span className={`text-xs px-2 py-0.5 rounded ${getEstadoColor(cita.estado)} inline-block self-start`}>
                                    {cita.estado}
                                  </span>
                                </div>
                              </div>

                              {isHovered && (
                                <div className="absolute left-full top-0 ml-2 z-[100] w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-start pb-2 border-b">
                                      <h3 className="font-bold text-sm">Detalle de Cita</h3>
                                      <span className={`text-xs px-2 py-1 rounded ${getEstadoColor(cita.estado)}`}>
                                        {cita.estado}
                                      </span>
                                    </div>
                                    <div className="bg-blue-50 rounded p-2">
                                      <p className="text-xs text-gray-600">Paciente</p>
                                      <p className="font-bold text-sm">{cita.pacienteNombre}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <p className="text-gray-600">Fecha:</p>
                                        <p className="font-semibold">{new Date(cita.fecha).toLocaleDateString('es-PE')}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Horario:</p>
                                        <p className="font-semibold">{cita.horaInicio} - {cita.horaFin}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Tratamiento:</p>
                                        <p className="font-semibold">{cita.tratamiento}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Médico:</p>
                                        <p className="font-semibold">{cita.odontologoNombre}</p>
                                      </div>
                                      {cita.sede && (
                                        <div className="col-span-2">
                                          <p className="text-gray-600">Sede:</p>
                                          <p className="font-semibold">{cita.sede}</p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                        }}
                                        className="px-2 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                      >
                                        Ver más
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                        }}
                                        className="px-2 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                                      >
                                        Editar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Cita */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Nueva Cita</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Paciente *</label>
                  <input
                    type="text"
                    value={formData.pacienteNombre}
                    onChange={(e) => setFormData({...formData, pacienteNombre: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Odontólogo *</label>
                  <select
                    value={formData.odontologoId}
                    onChange={(e) => setFormData({...formData, odontologoId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {odontologos.map(odontologo => (
                      <option key={odontologo.id} value={odontologo.id}>
                        {odontologo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha *</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora inicio *</label>
                  <select
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {horas.map(hora => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora fin *</label>
                  <select
                    value={formData.horaFin}
                    onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {horas.map(hora => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tratamiento *</label>
                <input
                  type="text"
                  value={formData.tratamiento}
                  onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea
                  rows={3}
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Agendar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {showDetailModal && selectedCita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-xl font-bold">📅 Detalle de Cita</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedCita(null)
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getEstadoColor(selectedCita.estado)}`}>
                  {selectedCita.estado}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setCitas(citas.map(c => 
                        c.id === selectedCita.id ? { ...c, estado: 'Confirmada' } : c
                      ))
                      setSelectedCita({ ...selectedCita, estado: 'Confirmada' })
                    }}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                  >
                    Confirmar
                  </button>
                  <button 
                    onClick={() => {
                      setCitas(citas.map(c => 
                        c.id === selectedCita.id ? { ...c, estado: 'Cancelada' } : c
                      ))
                      setSelectedCita({ ...selectedCita, estado: 'Cancelada' })
                    }}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Paciente</h3>
                <p className="text-xl font-bold text-gray-800">{selectedCita.pacienteNombre}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Odontólogo</p>
                  <p className="font-semibold text-gray-800">{selectedCita.odontologoNombre}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Tratamiento</p>
                  <p className="font-semibold text-gray-800">{selectedCita.tratamiento}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Fecha</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedCita.fecha).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Horario</p>
                  <p className="font-semibold text-gray-800">
                    {selectedCita.horaInicio} - {selectedCita.horaFin}
                  </p>
                </div>
              </div>

              {selectedCita.notas && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Notas</h3>
                  <p className="text-gray-700">{selectedCita.notas}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    alert('Función de edición en desarrollo')
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Editar Cita
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar esta cita?')) {
                      setCitas(citas.filter(c => c.id !== selectedCita.id))
                      setShowDetailModal(false)
                      setSelectedCita(null)
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}