import React, { useState } from 'react'
import { Box, Button, TextField, FormControlLabel, Switch, Card, CardContent, Typography } from '@mui/material'

export default function ProjectCreator({ onCreate }) {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [aiEnabled, setAiEnabled] = useState(false)

  const handleCreate = () => {
    if (!name || !budget) return
    onCreate({ name, budget: Number(budget), aiEnabled })
    setName('')
    setBudget('')
    setAiEnabled(false)
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Create New Project</Typography>
        <TextField fullWidth label="Project Name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
        <TextField fullWidth type="number" label="Budget ($)" value={budget} onChange={(e) => setBudget(e.target.value)} margin="normal" />
        <FormControlLabel control={<Switch checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />} label="Enable AI Assistance" />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreate}>Create Project</Button>
        </Box>
      </CardContent>
    </Card>
  )
}
