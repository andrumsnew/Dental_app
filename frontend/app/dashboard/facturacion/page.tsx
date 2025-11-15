'use client'

import { useState } from 'react'

// Importar funciones de generación de PDF
const generarPDFFactura = async (factura: any) => {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default
  
  const doc = new jsPDF()
  
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 15
  
  const colorPrimario = [79, 70, 229]
  const colorTexto = [31, 41, 55]
  
  // Encabezado
  doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2])
  doc.rect(0, 0, pageWidth, 35, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('DentalSaaS', margin, 15)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Sistema de Gestión Dental', margin, 22)
  doc.text('RUC: 20123456789', margin, 28)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(factura.numero, pageWidth - margin, 15, { align: 'right' })
  
  const estadoColor = factura.estado === 'Pagada' ? [34, 197, 94] : 
                     factura.estado === 'Pendiente' ? [234, 179, 8] : [239, 68, 68]
  doc.setFillColor(estadoColor[0], estadoColor[1], estadoColor[2])
  doc.roundedRect(pageWidth - margin - 40, 20, 40, 8, 2, 2, 'F')
  doc.setFontSize(10)
  doc.text(factura.estado, pageWidth - margin - 20, 25.5, { align: 'center' })
  
  // Información
  let yPos = 45
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2])
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURA A:', margin, yPos)
  
  yPos += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(factura.pacienteNombre, margin, yPos)
  
  yPos = 45
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha emisión:', pageWidth - 70, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(factura.fecha).toLocaleDateString('es-PE'), pageWidth - margin, yPos, { align: 'right' })
  
  yPos += 7
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha vencimiento:', pageWidth - 70, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(factura.fechaVencimiento).toLocaleDateString('es-PE'), pageWidth - margin, yPos, { align: 'right' })
  
  if (factura.metodoPago) {
    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Método de pago:', pageWidth - 70, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(factura.metodoPago, pageWidth - margin, yPos, { align: 'right' })
  }
  
  // Tabla
  yPos += 15
  const tableData = factura.items.map((item: any) => [
    item.tratamiento,
    item.cantidad.toString(),
    `S/ ${item.precioUnitario.toFixed(2)}`,
    `S/ ${item.subtotal.toFixed(2)}`
  ])
  
  autoTable(doc, {
    startY: yPos,
    head: [['Descripción', 'Cant.', 'Precio Unit.', 'Subtotal']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: colorPrimario,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: colorTexto
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 }
    },
    margin: { left: margin, right: margin }
  })
  
  // Totales
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 50
  yPos = finalY + 10
  
  const boxX = pageWidth - margin - 70
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', boxX, yPos)
  doc.text(`S/ ${factura.subtotal.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  
  if (factura.descuento > 0) {
    yPos += 7
    doc.text('Descuento:', boxX, yPos)
    doc.setTextColor(239, 68, 68)
    doc.text(`- S/ ${factura.descuento.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2])
  }
  
  yPos += 5
  doc.line(boxX, yPos, pageWidth - margin, yPos)
  
  yPos += 7
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', boxX, yPos)
  doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2])
  doc.text(`S/ ${factura.total.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  
  // Notas
  if (factura.notas) {
    yPos += 15
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2])
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Notas:', margin, yPos)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    const notasLines = doc.splitTextToSize(factura.notas, pageWidth - (margin * 2))
    doc.text(notasLines, margin, yPos)
  }
  
  // Footer
  const footerY = pageHeight - 30
  doc.setDrawColor(107, 114, 128)
  doc.line(margin, footerY, pageWidth - margin, footerY)
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('DentalSaaS - Sistema de Gestión Dental', pageWidth / 2, footerY + 5, { align: 'center' })
  doc.text('Av. Principal 123, Lima, Perú', pageWidth / 2, footerY + 10, { align: 'center' })
  doc.text('Tel: (01) 123-4567 | Email: contacto@dentalsaas.pe', pageWidth / 2, footerY + 15, { align: 'center' })
  
  doc.save(`Factura_${factura.numero}.pdf`)
}

const imprimirFactura = async (factura: any) => {
  const jsPDF = (await import('jspdf')).default
  const doc = new jsPDF()
  // Mismo código que generarPDFFactura pero al final:
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  const printWindow = window.open(pdfUrl)
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

interface ItemFactura {
  id: number
  tratamiento: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

interface Factura {
  id: number
  numero: string
  pacienteId: number
  pacienteNombre: string
  fecha: string
  fechaVencimiento: string
  items: ItemFactura[]
  subtotal: number
  descuento: number
  total: number
  estado: 'Pendiente' | 'Pagada' | 'Vencida'
  metodoPago?: string
  notas?: string
}

export default function FacturacionPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('Todos')
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null)

  // Catálogo de tratamientos (vendría del módulo de Tratamientos)
  const tratamientosDisponibles = [
    { id: 1, nombre: 'Limpieza dental', precio: 80 },
    { id: 2, nombre: 'Obturación con resina', precio: 150 },
    { id: 3, nombre: 'Endodoncia', precio: 400 },
    { id: 4, nombre: 'Extracción simple', precio: 120 },
    { id: 5, nombre: 'Blanqueamiento dental', precio: 500 },
    { id: 6, nombre: 'Corona de porcelana', precio: 800 },
  ]

  const [facturas, setFacturas] = useState<Factura[]>([
    {
      id: 1,
      numero: 'F-2024-001',
      pacienteId: 1,
      pacienteNombre: 'María García López',
      fecha: '2024-11-10',
      fechaVencimiento: '2024-11-17',
      items: [
        { id: 1, tratamiento: 'Limpieza dental', cantidad: 1, precioUnitario: 80, subtotal: 80 }
      ],
      subtotal: 80,
      descuento: 0,
      total: 80,
      estado: 'Pagada',
      metodoPago: 'Efectivo'
    },
    {
      id: 2,
      numero: 'F-2024-002',
      pacienteId: 2,
      pacienteNombre: 'Juan Pérez Torres',
      fecha: '2024-11-12',
      fechaVencimiento: '2024-11-19',
      items: [
        { id: 1, tratamiento: 'Extracción simple', cantidad: 1, precioUnitario: 120, subtotal: 120 },
        { id: 2, tratamiento: 'Obturación con resina', cantidad: 2, precioUnitario: 150, subtotal: 300 }
      ],
      subtotal: 420,
      descuento: 20,
      total: 400,
      estado: 'Pendiente',
      notas: 'Descuento por segundo tratamiento'
    },
    {
      id: 3,
      numero: 'F-2024-003',
      pacienteId: 3,
      pacienteNombre: 'Ana Torres Ramos',
      fecha: '2024-10-25',
      fechaVencimiento: '2024-11-01',
      items: [
        { id: 1, tratamiento: 'Endodoncia', cantidad: 1, precioUnitario: 400, subtotal: 400 }
      ],
      subtotal: 400,
      descuento: 0,
      total: 400,
      estado: 'Vencida'
    },
    {
      id: 4,
      numero: 'F-2024-004',
      pacienteId: 4,
      pacienteNombre: 'Carlos Ruiz Mendoza',
      fecha: '2024-11-14',
      fechaVencimiento: '2024-11-21',
      items: [
        { id: 1, tratamiento: 'Blanqueamiento dental', cantidad: 1, precioUnitario: 500, subtotal: 500 }
      ],
      subtotal: 500,
      descuento: 0,
      total: 500,
      estado: 'Pagada',
      metodoPago: 'Tarjeta'
    },
  ])

  // Formulario para nueva factura
  const [formFactura, setFormFactura] = useState({
    pacienteNombre: '',
    items: [] as ItemFactura[],
    descuento: 0,
    notas: ''
  })

  const [itemActual, setItemActual] = useState({
    tratamiento: '',
    cantidad: 1,
    precio: 0
  })

  // Filtrar facturas
  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = 
      factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filterEstado === 'Todos' || factura.estado === filterEstado

    return matchesSearch && matchesEstado
  })

  const agregarItem = () => {
    if (itemActual.tratamiento && itemActual.cantidad > 0) {
      const nuevoItem: ItemFactura = {
        id: formFactura.items.length + 1,
        tratamiento: itemActual.tratamiento,
        cantidad: itemActual.cantidad,
        precioUnitario: itemActual.precio,
        subtotal: itemActual.cantidad * itemActual.precio
      }
      setFormFactura({
        ...formFactura,
        items: [...formFactura.items, nuevoItem]
      })
      setItemActual({ tratamiento: '', cantidad: 1, precio: 0 })
    }
  }

  const eliminarItem = (itemId: number) => {
    setFormFactura({
      ...formFactura,
      items: formFactura.items.filter(item => item.id !== itemId)
    })
  }

  const calcularSubtotal = () => {
    return formFactura.items.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const calcularTotal = () => {
    return calcularSubtotal() - formFactura.descuento
  }

  const handleSubmitFactura = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formFactura.items.length === 0) {
      alert('Debes agregar al menos un tratamiento')
      return
    }

    const nuevaFactura: Factura = {
      id: facturas.length + 1,
      numero: `F-2024-${String(facturas.length + 1).padStart(3, '0')}`,
      pacienteId: 0,
      pacienteNombre: formFactura.pacienteNombre,
      fecha: new Date().toISOString().split('T')[0],
      fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: formFactura.items,
      subtotal: calcularSubtotal(),
      descuento: formFactura.descuento,
      total: calcularTotal(),
      estado: 'Pendiente',
      notas: formFactura.notas
    }

    setFacturas([nuevaFactura, ...facturas])
    setShowModal(false)
    setFormFactura({
      pacienteNombre: '',
      items: [],
      descuento: 0,
      notas: ''
    })
  }

  const marcarComoPagada = (facturaId: number, metodo: string) => {
    setFacturas(facturas.map(f => 
      f.id === facturaId 
        ? { ...f, estado: 'Pagada' as const, metodoPago: metodo }
        : f
    ))
    setShowDetailModal(false)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pagada': return 'bg-green-100 text-green-700'
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700'
      case 'Vencida': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Calcular estadísticas
  const totalFacturado = facturas.reduce((sum, f) => sum + f.total, 0)
  const totalPagado = facturas.filter(f => f.estado === 'Pagada').reduce((sum, f) => sum + f.total, 0)
  const totalPendiente = facturas.filter(f => f.estado === 'Pendiente').reduce((sum, f) => sum + f.total, 0)
  const facturasPendientes = facturas.filter(f => f.estado === 'Pendiente').length

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Facturado</p>
              <p className="text-3xl font-bold text-indigo-600">S/ {totalFacturado.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cobrado</p>
              <p className="text-3xl font-bold text-green-600">S/ {totalPagado.toLocaleString()}</p>
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
              <p className="text-sm text-gray-600 mb-1">Por Cobrar</p>
              <p className="text-3xl font-bold text-yellow-600">S/ {totalPendiente.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Facturas Pendientes</p>
              <p className="text-3xl font-bold text-red-600">{facturasPendientes}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por número o paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {(['Todos', 'Pendiente', 'Pagada', 'Vencida'] as const).map((estado) => (
              <button
                key={estado}
                onClick={() => setFilterEstado(estado)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterEstado === estado
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Lista de facturas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Número</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFacturas.map((factura) => (
                <tr key={factura.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-indigo-600">{factura.numero}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{factura.pacienteNombre}</p>
                    <p className="text-sm text-gray-500">{factura.items.length} item(s)</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(factura.fecha).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(factura.fechaVencimiento).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-lg font-bold text-gray-800">S/ {factura.total.toLocaleString()}</p>
                    {factura.descuento > 0 && (
                      <p className="text-xs text-gray-500">Desc: S/ {factura.descuento}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(factura.estado)}`}>
                      {factura.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedFactura(factura)
                          setShowDetailModal(true)
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {factura.estado === 'Pendiente' && (
                        <button
                          onClick={() => {
                            if (confirm('¿Marcar esta factura como pagada?')) {
                              marcarComoPagada(factura.id, 'Efectivo')
                            }
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marcar como pagada"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFacturas.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No se encontraron facturas</p>
          </div>
        )}
      </div>

      {/* Modal para nueva factura */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">Nueva Factura</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setFormFactura({
                    pacienteNombre: '',
                    items: [],
                    descuento: 0,
                    notas: ''
                  })
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitFactura} className="p-6 space-y-6">
              {/* Paciente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paciente *
                </label>
                <input
                  type="text"
                  value={formFactura.pacienteNombre}
                  onChange={(e) => setFormFactura({...formFactura, pacienteNombre: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Nombre del paciente"
                  required
                />
              </div>

              {/* Agregar items */}
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-4">Agregar Tratamiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <select
                      value={itemActual.tratamiento}
                      onChange={(e) => {
                        const tratamiento = tratamientosDisponibles.find(t => t.nombre === e.target.value)
                        setItemActual({
                          ...itemActual,
                          tratamiento: e.target.value,
                          precio: tratamiento?.precio || 0
                        })
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Seleccionar tratamiento</option>
                      {tratamientosDisponibles.map(t => (
                        <option key={t.id} value={t.nombre}>{t.nombre} - S/ {t.precio}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={itemActual.cantidad}
                      onChange={(e) => setItemActual({...itemActual, cantidad: parseInt(e.target.value) || 1})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Cant."
                      min="1"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={agregarItem}
                      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de items */}
              {formFactura.items.length > 0 && (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tratamiento</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Precio</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Subtotal</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formFactura.items.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm">{item.tratamiento}</td>
                          <td className="px-4 py-3 text-sm text-center">{item.cantidad}</td>
                          <td className="px-4 py-3 text-sm text-right">S/ {item.precioUnitario}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-right">S/ {item.subtotal}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => eliminarItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totales */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">S/ {calcularSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Descuento:</span>
                  <input
                    type="number"
                    value={formFactura.descuento}
                    onChange={(e) => setFormFactura({...formFactura, descuento: parseFloat(e.target.value) || 0})}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg">
                  <span className="font-bold text-gray-800">TOTAL:</span>
                  <span className="font-bold text-indigo-600">S/ {calcularTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  rows={2}
                  value={formFactura.notas}
                  onChange={(e) => setFormFactura({...formFactura, notas: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Observaciones sobre la factura..."
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormFactura({
                      pacienteNombre: '',
                      items: [],
                      descuento: 0,
                      notas: ''
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
                  Generar Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalle de factura */}
      {showDetailModal && selectedFactura && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Factura {selectedFactura.numero}</h2>
                  <p className="text-sm opacity-90">Fecha: {new Date(selectedFactura.fecha).toLocaleDateString('es-PE')}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedFactura(null)
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información del paciente */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Paciente</h3>
                <p className="text-xl font-bold text-gray-800">{selectedFactura.pacienteNombre}</p>
              </div>

              {/* Estado y método de pago */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Estado</p>
                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getEstadoColor(selectedFactura.estado)}`}>
                    {selectedFactura.estado}
                  </span>
                </div>
                {selectedFactura.metodoPago && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Método de Pago</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedFactura.metodoPago}</p>
                  </div>
                )}
              </div>

              {/* Detalle de items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Detalle de Tratamientos</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Descripción</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Precio Unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedFactura.items.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-800">{item.tratamiento}</td>
                          <td className="px-4 py-3 text-sm text-center">{item.cantidad}</td>
                          <td className="px-4 py-3 text-sm text-right">S/ {item.precioUnitario}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-right">S/ {item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">S/ {selectedFactura.subtotal.toLocaleString()}</span>
                </div>
                {selectedFactura.descuento > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuento:</span>
                    <span className="font-semibold text-red-600">- S/ {selectedFactura.descuento.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 flex justify-between text-xl">
                  <span className="font-bold text-gray-800">TOTAL:</span>
                  <span className="font-bold text-indigo-600">S/ {selectedFactura.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Notas */}
              {selectedFactura.notas && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2">Notas</h3>
                  <p className="text-sm text-gray-700">{selectedFactura.notas}</p>
                </div>
              )}

              {/* Acciones */}
              {selectedFactura.estado === 'Pendiente' && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Marcar como Pagada</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => marcarComoPagada(selectedFactura.id, 'Efectivo')}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      💵 Efectivo
                    </button>
                    <button
                      onClick={() => marcarComoPagada(selectedFactura.id, 'Tarjeta')}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      💳 Tarjeta
                    </button>
                    <button
                      onClick={() => marcarComoPagada(selectedFactura.id, 'Transferencia')}
                      className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      🏦 Transferencia
                    </button>
                  </div>
                </div>
              )}

              {/* Botón de cerrar */}
              <div className="flex gap-3">
                <button
                  onClick={() => generarPDFFactura(selectedFactura)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar PDF
                </button>
                
                <button
                  onClick={() => imprimirFactura(selectedFactura)}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir
                </button>
                
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedFactura(null)
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}