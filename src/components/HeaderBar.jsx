import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Stack, Snackbar, Alert } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { deleteProjectData } from '../services/firestore'

export default function HeaderBar({ onReset }) {
  const [openSnackbar, setOpenSnackbar] = useState(false)

  // Copy current URL to clipboard
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setOpenSnackbar(true)
    } catch (err) {
      console.error('Failed to copy link', err)
      alert('Could not copy link. Please copy manually.')
    }
  }

  // Reset project and remove URL param
  const handleReset = async () => {
    if (confirm('Reset all project data? This cannot be undone.')) {
      const urlParams = new URLSearchParams(window.location.search)
      const projectId = urlParams.get('id') || localStorage.getItem('broadpmProjectId')

      if (projectId) {
        await deleteProjectData(projectId)
      }

      onReset()
    }
  }

  return (
    <>
      <AppBar position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <AssignmentIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            BroadPM Alpha
          </Typography>

          {/* Buttons on right side */}
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={handleShare}>
              Copy Share Link
            </Button>
            <Button color="inherit" onClick={handleReset}>
              Reset
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Snackbar Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}
