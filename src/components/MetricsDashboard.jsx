import React from 'react'
import { Box, Paper, Typography, LinearProgress, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const processGroups = [
  "Initiating",
  "Planning",
  "Executing",
  "Monitoring & Controlling",
  "Closing"
]

export default function MetricsDashboard({ tasks, budget }) {
  const theme = useTheme()

  // Map groups to theme palette (primary/secondary/warning/error/info)
  const columnColors = {
    "Initiating": theme.palette.primary.main,
    "Planning": theme.palette.secondary.main,
    "Executing": theme.palette.info.main || '#9c27b0',
    "Monitoring & Controlling": theme.palette.warning.main,
    "Closing": theme.palette.error.main
  }

  // Overall progress
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const overallProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Progress per process group
  const groupProgress = processGroups.map(group => {
    const groupTasks = tasks.filter(t => t.processGroup === group)
    const completedGroup = groupTasks.filter(t => t.completed).length
    const progress = groupTasks.length ? Math.round((completedGroup / groupTasks.length) * 100) : 0
    return { group, progress }
  })

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Project Progress
      </Typography>

      {/* Overall Progress */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Overall Progress: {overallProgress}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={overallProgress}
          sx={{
            height: 10,
            borderRadius: 5,
            [`& .MuiLinearProgress-bar`]: { backgroundColor: theme.palette.primary.main }
          }}
        />
      </Box>

      {/* Per Process Group Progress */}
      <Grid container spacing={2}>
        {groupProgress.map(({ group, progress }) => (
          <Grid item xs={12} sm={6} md={2.4} key={group}>
            <Paper
              sx={{
                p: 1,
                textAlign: 'center',
                borderTop: `3px solid ${columnColors[group]}`
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', color: columnColors[group] }}
              >
                {group}
              </Typography>
              <Typography variant="body2">{progress}%</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  [`& .MuiLinearProgress-bar`]: { backgroundColor: columnColors[group] }
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Placeholder for future cost metrics */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Cost metrics (CPI, SPI, EAC) coming soon
        </Typography>
      </Box>
    </Paper>
  )
}
