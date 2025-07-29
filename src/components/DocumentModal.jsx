import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { marked } from 'marked'

export default function DocumentModal({ open, onClose, title, content, setContent }) {
  // Markdown to PDF
  const handlePDFDownload = async () => {
    // Convert markdown to HTML
    const htmlContent = marked(content)

    // Create hidden container for styled render
    const container = document.createElement('div')
    container.innerHTML = htmlContent
    container.style.width = '600px'
    container.style.padding = '20px'
    container.style.fontFamily = 'Arial, sans-serif'
    container.style.lineHeight = '1.5'
    container.style.fontSize = '12pt'

    // Basic style adjustments
    container.querySelectorAll('h1').forEach(h => {
      h.style.fontSize = '20pt'
      h.style.fontWeight = 'bold'
      h.style.marginBottom = '10px'
    })
    container.querySelectorAll('h2').forEach(h => {
      h.style.fontSize = '16pt'
      h.style.marginBottom = '8px'
    })
    container.querySelectorAll('p, li').forEach(el => {
      el.style.marginBottom = '6px'
    })

    document.body.appendChild(container)

    // Render container to canvas
    const canvas = await html2canvas(container, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    // Create PDF
    const pdf = new jsPDF('p', 'pt', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 40 // padding
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let y = 20
    if (imgHeight > pageHeight) {
      // Multi-page logic
      let position = 0
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight, '', 'FAST')
        position += pageHeight
        if (position < imgHeight) pdf.addPage()
      }
    } else {
      pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight, '', 'FAST')
    }

    pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)

    // Clean up hidden container
    document.body.removeChild(container)
  }

  // Markdown download stays same
  const handleMarkdownDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title} Document</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={15}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="outlined" onClick={handleMarkdownDownload}>
          Download .MD
        </Button>
        <Button variant="contained" onClick={handlePDFDownload}>
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  )
}
