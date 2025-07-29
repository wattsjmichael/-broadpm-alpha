import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Paper,
  Fade
} from '@mui/material'

const steps = ['Project Details', 'Budget', 'AI Options']

export default function ProjectWizard({ onFinish }) {
  const [activeStep, setActiveStep] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [aiEnabled, setAiEnabled] = useState(false)

  // Refs for auto-focus
  const nameRef = useRef(null)
  const budgetRef = useRef(null)

  useEffect(() => {
    if (activeStep === 0 && nameRef.current) nameRef.current.focus()
    if (activeStep === 1 && budgetRef.current) budgetRef.current.focus()
  }, [activeStep])

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onFinish({
        name: projectName,
        description: projectDescription,
        budget: Number(budget),
        aiEnabled
      })
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        New Project Setup
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content with Fade animation */}
      <Fade in timeout={400} key={activeStep}>
        <Box>
          {activeStep === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                inputRef={nameRef}
                fullWidth
              />
              <TextField
                label="Description (optional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Budget ($)"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                inputRef={budgetRef}
                fullWidth
              />
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={aiEnabled}
                    onChange={(e) => setAiEnabled(e.target.checked)}
                  />
                }
                label="Enable AI document drafting (Coming Soon)"
              />
            </Box>
          )}
        </Box>
      </Fade>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === 0 && !projectName}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  )
}
