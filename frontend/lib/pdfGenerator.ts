import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
  pacienteNombre: string
  fecha: string
  fechaVencimiento: string
  items: ItemFactura[]
  subtotal: number
  descuento: number
  total: number
  estado: string
  metodoPago?: string
  notas?: string
}

export const generarPDFFactura = (factura: Factura) => {
  const doc = new jsPDF()
  
  // Configuración
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 15
  
  // Colores
  const colorPrimario: [number, number, number] = [79, 70, 229]
  const colorSecundario: [number, number, number] = [107, 114, 128]
  const colorTexto: [number, number, number] = [31, 41, 55]
  
  // ====================
  // ENCABEZADO
  // ====================
  
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
  
  // Número de factura
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(factura.numero, pageWidth - margin, 15, { align: 'right' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255)
  
  const estadoColor: [number, number, number] = factura.estado === 'Pagada' ? [34, 197, 94] : 
                     factura.estado === 'Pendiente' ? [234, 179, 8] : 
                     [239, 68, 68]
  
  doc.setFillColor(estadoColor[0], estadoColor[1], estadoColor[2])
  doc.roundedRect(pageWidth - margin - 40, 20, 40, 8, 2, 2, 'F')
  doc.text(factura.estado, pageWidth - margin - 20, 25.5, { align: 'center' })
  
  // ====================
  // INFORMACIÓN
  // ====================
  
  let yPos = 45
  
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2])
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURA A:', margin, yPos)
  
  yPos += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(factura.pacienteNombre, margin, yPos)
  
  // Fechas
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
  
  // ====================
  // TABLA DE ITEMS
  // ====================
  
  yPos += 15
  
  const tableData = factura.items.map(item => [
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
      textColor: [255, 255, 255] as [number, number, number],
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
    margin: { left: margin, right: margin },
    didDrawPage: function() {
      const str = `Página ${doc.getCurrentPageInfo().pageNumber}`
      doc.setFontSize(8)
      doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2])
      doc.text(str, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }
  })
  
  // ====================
  // TOTALES
  // ====================
  
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 50
  yPos = finalY + 10
  
  const boxX = pageWidth - margin - 70
  
  doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2])
  doc.setLineWidth(0.5)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  // Subtotal
  doc.text('Subtotal:', boxX, yPos)
  doc.text(`S/ ${factura.subtotal.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  
  // Descuento
  if (factura.descuento > 0) {
    yPos += 7
    doc.text('Descuento:', boxX, yPos)
    doc.setTextColor(239, 68, 68)
    doc.text(`- S/ ${factura.descuento.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2])
  }
  
  // Línea
  yPos += 5
  doc.line(boxX, yPos, pageWidth - margin, yPos)
  
  // Total
  yPos += 7
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', boxX, yPos)
  doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2])
  doc.text(`S/ ${factura.total.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  
  // ====================
  // NOTAS
  // ====================
  
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
  
  // ====================
  // PIE DE PÁGINA
  // ====================
  
  const footerY = pageHeight - 30
  
  doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2])
  doc.line(margin, footerY, pageWidth - margin, footerY)
  
  doc.setFontSize(8)
  doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2])
  doc.setFont('helvetica', 'normal')
  
  doc.text('DentalSaaS - Sistema de Gestión Dental', pageWidth / 2, footerY + 5, { align: 'center' })
  doc.text('Av. Principal 123, Lima, Perú', pageWidth / 2, footerY + 10, { align: 'center' })
  doc.text('Tel: (01) 123-4567 | Email: contacto@dentalsaas.pe', pageWidth / 2, footerY + 15, { align: 'center' })
  
  // ====================
  // GUARDAR
  // ====================
  
  doc.save(`Factura_${factura.numero}.pdf`)
}

export const imprimirFactura = (factura: Factura) => {
  const doc = new jsPDF()
  
  // Generar el mismo PDF
  generarPDFFactura(factura)
  
  // Abrir para imprimir
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  const printWindow = window.open(pdfUrl)
  
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}