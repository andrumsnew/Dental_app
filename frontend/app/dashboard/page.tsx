//app/dashboard/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  
  // Estado para mostrar/ocultar valores sensibles
  const [hiddenStats, setHiddenStats] = useState<Record<string, boolean>>({})

  const toggleStat = (statTitle: string) => {
    setHiddenStats(prev => ({
      ...prev,
      [statTitle]: !prev[statTitle]
    }))
  }

  // Datos de ejemplo (luego vendrán del backend)
  const stats = [
    {
      title: 'Citas Hoy',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'Pacientes Activos',
      value: '248',
      change: '+12',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'Ingresos del Mes',
      value: 'S/ 24,500',
      change: '+8%',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500'
    },
  ]

  const recentAppointments = [
    { id: 1, patient: 'María García', time: '09:00 AM', treatment: 'Limpieza dental', status: 'Confirmada' },
    { id: 2, patient: 'Juan Pérez', time: '10:30 AM', treatment: 'Extracción', status: 'Pendiente' },
    { id: 3, patient: 'Ana Torres', time: '02:00 PM', treatment: 'Ortodoncia', status: 'Confirmada' },
    { id: 4, patient: 'Carlos Ruiz', time: '03:30 PM', treatment: 'Endodoncia', status: 'Confirmada' },
    { id: 5, patient: 'Luis Mendoza', time: '04:30 PM', treatment: 'Blanqueamiento', status: 'Confirmada' },
    { id: 6, patient: 'Patricia Silva', time: '05:00 PM', treatment: 'Consulta', status: 'Pendiente' },
  ]

  const topTreatments = [
    { name: 'Limpieza dental', count: 45, percentage: 30 },
    { name: 'Ortodoncia', count: 32, percentage: 21 },
    { name: 'Blanqueamiento', count: 28, percentage: 19 },
    { name: 'Extracción', count: 24, percentage: 16 },
    { name: 'Endodoncia', count: 21, percentage: 14 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <button
                    onClick={() => toggleStat(stat.title)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title={hiddenStats[stat.title] ? "Mostrar" : "Ocultar"}
                  >
                    {hiddenStats[stat.title] ? (
                      // Ojo tachado (oculto)
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      // Ojo normal (visible)
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {hiddenStats[stat.title] ? (
                  <p className="text-3xl font-bold text-gray-400">***</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} desde ayer
                    </p>
                  </>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citas de Hoy con Scroll Horizontal */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Citas de Hoy</h3>
            <button 
              onClick={() => router.push('/dashboard/agenda')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Ver todas →
            </button>
          </div>
          
          {/* Contenedor con scroll horizontal */}
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex gap-4 min-w-max">
              {recentAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex-shrink-0 w-80 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold text-sm">
                        {appointment.patient.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{appointment.patient}</p>
                      <p className="text-sm text-gray-600 truncate">{appointment.treatment}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{appointment.time}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmada' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Indicador de scroll */}
          <p className="text-xs text-gray-400 mt-3 text-center">
            ← Desliza para ver más citas →
          </p>
        </div>

        {/* Tratamientos Más Realizados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Tratamientos Populares</h3>
          
          <div className="space-y-4">
            {topTreatments.map((treatment, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{treatment.name}</span>
                  <span className="text-sm text-gray-600">{treatment.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${treatment.percentage * 3}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => router.push('/dashboard/agenda?nueva=true')}
            className="flex flex-col items-center gap-2 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Nueva Cita</span>
          </button>
          
          <button 
            onClick={() => router.push('/dashboard/pacientes/registro')}
            className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Nuevo Paciente</span>
          </button>
          
          <button 
            onClick={() => router.push('/dashboard/facturacion')}
            className="flex flex-col items-center gap-2 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Ver Reportes</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Configuración</span>
          </button>
        </div>
      </div>
    </div>
  )
}