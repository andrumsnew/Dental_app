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
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Abrir modal si viene el parámetro ?nueva=true
  useEffect(() => {
    if (searchParams.get('nueva') === 'true') {
      // Pre-llenar con la fecha de hoy
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, fecha: today }))
      setShowModal(true)
    }
  }, [searchParams])

  const odontologos: Odontologo[] = [
    { id: 1, nombre: 'Dr. García', color: 'bg-blue-500' },
    { id: 2, nombre: 'Dra. Rodríguez', color: 'bg-purple-500' },
    { id: 3, nombre: 'Dr. Martínez', color: 'bg-green-500' },
  ]

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0]

  const [citas, setCitas] = useState<Cita[]>([
    {
      id: 1,
      pacienteId: 1,
      pacienteNombre: 'María García López',
      odontologoId: 1,
      odontologoNombre: 'Dr. García',
      fecha: today,
      horaInicio: '09:00',
      horaFin: '09:30',
      tratamiento: 'Limpieza dental',
      estado: 'Confirmada',
      notas: 'Primera visita'
    },
    {
      id: 2,
      pacienteId: 2,
      pacienteNombre: 'Juan Pérez Torres',
      odontologoId: 1,
      odontologoNombre: 'Dr. García',
      fecha: today,
      horaInicio: '10:30',
      horaFin: '11:30',
      tratamiento: 'Extracción',
      estado: 'Pendiente'
    },
    {
      id: 3,
      pacienteId: 3,
      pacienteNombre: 'Ana Torres Ramos',
      odontologoId: 2,
      odontologoNombre: 'Dra. Rodríguez',
      fecha: today,
      horaInicio: '14:00',
      horaFin: '15:00',
      tratamiento: 'Ortodoncia',
      estado: 'Confirmada'
    },
    {
      id: 4,
      pacienteId: 4,
      pacienteNombre: 'Carlos Ruiz Mendoza',
      odontologoId: 3,
      odontologoNombre: 'Dr. Martínez',
      fecha: today,
      horaInicio: '15:30',
      horaFin: '16:30',
      tratamiento: 'Endodoncia',
      estado: 'Confirmada'
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

  // Generar horas del día (8:00 - 20:00) cada 30 minutos
  const horas = []
  for (let h = 8; h <= 20; h++) {
    horas.push(`${h.toString().padStart(2, '0')}:00`)
    if (h < 20) {
      horas.push(`${h.toString().padStart(2, '0')}:30`)
    }
  }

  // Obtener días de la semana actual
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

  // Filtrar citas
  const filteredCitas = citas.filter(cita => {
    if (selectedOdontologo && cita.odontologoId !== selectedOdontologo) return false
    return true
  })

  // Obtener citas de un día específico
  const getCitasDelDia = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0]
    return filteredCitas.filter(cita => cita.fecha === fechaStr)
  }

  // Cambiar semana
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
    
    // Navegar a la fecha de la cita creada
    setSelectedDate(new Date(formData.fecha))
    
    // Mostrar mensaje de éxito
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
      case 'Confirmada': return 'bg-green-100 text-green-700'
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700'
      case 'Cancelada': return 'bg-red-100 text-red-700'
      case 'Completada': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">¡Cita agendada exitosamente!</span>
        </div>
      )}

      {/* Header con controles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Navegación de fecha */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => cambiarSemana('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedDate.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-sm text-gray-600">
                {weekDays[0].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} - {' '}
                {weekDays[6].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
              </p>
            </div>

            <button
              onClick={() => cambiarSemana('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Hoy
            </button>
          </div>

          {/* Filtro por odontólogo */}
          <div className="flex items-center gap-4">
            <select
              value={selectedOdontologo}
              onChange={(e) => setSelectedOdontologo(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* Vista semanal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header de días */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              <div className="p-4 text-sm font-semibold text-gray-600">Hora</div>
              {weekDays.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString()
                return (
                  <div
                    key={index}
                    className={`p-4 text-center ${isToday ? 'bg-indigo-50' : ''}`}
                  >
                    <p className="text-xs text-gray-600 uppercase">
                      {day.toLocaleDateString('es-PE', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
                      {day.getDate()}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Grid de horas */}
            <div className="divide-y divide-gray-200">
              {horas.map((hora) => (
                <div key={hora} className="grid grid-cols-8 min-h-[50px]">
                  <div className="p-3 text-xs text-gray-600 font-medium border-r border-gray-200">
                    {hora}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const fechaStr = day.toISOString().split('T')[0]
                    const citasDelDia = filteredCitas.filter(cita => cita.fecha === fechaStr)
                    
                    // Buscar citas que empiecen en este bloque de tiempo
                    const citasEnHora = citasDelDia.filter(cita => {
                      const horaInicio = cita.horaInicio.substring(0, 5) // "09:00"
                      const [h, m] = horaInicio.split(':').map(Number)
                      const [hBloque, mBloque] = hora.split(':').map(Number)
                      
                      // Si la hora coincide exactamente
                      if (h === hBloque && m === mBloque) return true
                      
                      // Si está en el rango de este bloque (ej: 09:15 se muestra en 09:00 o 09:30)
                      if (h === hBloque) {
                        if (mBloque === 0 && m < 30) return true
                        if (mBloque === 30 && m >= 30) return true
                      }
                      
                      return false
                    })
                    
                    return (
                      <div key={dayIndex} className="p-1 border-r border-gray-200 hover:bg-gray-50 relative">
                        {citasEnHora.map((cita) => {
                          const odontologo = odontologos.find(o => o.id === cita.odontologoId)
                          return (
                            <div
                              key={cita.id}
                              onClick={() => {
                                setSelectedCita(cita)
                                setShowDetailModal(true)
                              }}
                              className={`${odontologo?.color} bg-opacity-20 border-l-4 ${odontologo?.color} p-2 rounded mb-1 cursor-pointer hover:shadow-lg transition-all hover:scale-105`}
                            >
                              <p className="text-xs font-bold text-gray-800 truncate">
                                {cita.horaInicio} - {cita.pacienteNombre}
                              </p>
                              <p className="text-xs text-gray-600 truncate">{cita.tratamiento}</p>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${getEstadoColor(cita.estado)}`}>
                                {cita.estado}
                              </span>
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

      {/* Lista de citas del día */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Citas de hoy ({getCitasDelDia(new Date()).length})
        </h3>
        <div className="space-y-3">
          {getCitasDelDia(new Date()).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay citas programadas para hoy</p>
          ) : (
            getCitasDelDia(new Date()).map((cita) => (
              <div key={cita.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{cita.horaInicio}</p>
                    <p className="text-xs text-gray-500">{cita.horaFin}</p>
                  </div>
                  <div className="h-12 w-1 bg-indigo-600 rounded"></div>
                  <div>
                    <p className="font-semibold text-gray-800">{cita.pacienteNombre}</p>
                    <p className="text-sm text-gray-600">{cita.tratamiento}</p>
                    <p className="text-xs text-gray-500">{cita.odontologoNombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                    {cita.estado}
                  </span>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para nueva cita */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Nueva Cita</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paciente *
                  </label>
                  <input
                    type="text"
                    value={formData.pacienteNombre}
                    onChange={(e) => setFormData({...formData, pacienteNombre: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Nombre del paciente"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Odontólogo *
                  </label>
                  <select
                    value={formData.odontologoId}
                    onChange={(e) => setFormData({...formData, odontologoId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora inicio *
                  </label>
                  <select
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {Array.from({ length: 52 }, (_, i) => {
                      const h = Math.floor(i / 4) + 8
                      const m = (i % 4) * 15
                      if (h > 20) return null
                      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                      return <option key={time} value={time}>{time}</option>
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora fin *
                  </label>
                  <select
                    value={formData.horaFin}
                    onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {Array.from({ length: 52 }, (_, i) => {
                      const h = Math.floor(i / 4) + 8
                      const m = (i % 4) * 15
                      if (h > 20) return null
                      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                      return <option key={time} value={time}>{time}</option>
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento *
                </label>
                <input
                  type="text"
                  value={formData.tratamiento}
                  onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ej: Limpieza dental, Extracción, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  rows={3}
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Información adicional sobre la cita..."
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  Agendar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalle de cita */}
      {showDetailModal && selectedCita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-bold">Detalle de Cita</h2>
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

            <div className="p-6 space-y-6">
              {/* Estado */}
              <div className="flex items-center justify-between pb-4 border-b">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getEstadoColor(selectedCita.estado)}`}>
                  {selectedCita.estado}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setCitas(citas.map(c => 
                        c.id === selectedCita.id 
                          ? { ...c, estado: 'Confirmada' }
                          : c
                      ))
                      setSelectedCita({ ...selectedCita, estado: 'Confirmada' })
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    Confirmar
                  </button>
                  <button 
                    onClick={() => {
                      setCitas(citas.map(c => 
                        c.id === selectedCita.id 
                          ? { ...c, estado: 'Cancelada' }
                          : c
                      ))
                      setSelectedCita({ ...selectedCita, estado: 'Cancelada' })
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              {/* Información del paciente */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Paciente
                </h3>
                <p className="text-2xl font-bold text-gray-800">{selectedCita.pacienteNombre}</p>
              </div>

              {/* Información de la cita */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Odontólogo</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedCita.odontologoNombre}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Tratamiento</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedCita.tratamiento}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Fecha</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(selectedCita.fecha).toLocaleDateString('es-PE', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Horario</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedCita.horaInicio} - {selectedCita.horaFin}
                  </p>
                </div>
              </div>

              {/* Notas */}
              {selectedCita.notas && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Notas adicionales
                  </h3>
                  <p className="text-gray-700">{selectedCita.notas}</p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    // Aquí iría la lógica para editar
                    alert('Función de edición en desarrollo')
                  }}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Cita
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar esta cita?')) {
                      setCitas(citas.filter(c => c.id !== selectedCita.id))
                      setShowDetailModal(false)
                      setSelectedCita(null)
                    }
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
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
    </div>
  )
}