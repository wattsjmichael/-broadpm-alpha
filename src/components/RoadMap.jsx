import React from 'react'
import { Box, Card, CardContent, Typography, Grid } from '@mui/material'

// Roadmap data
const roadmapItems = {
  now: [
    { title: 'Kanban Board', desc: 'Drag-and-drop tasks with PMBOK alignment' },
    { title: 'Metrics Dashboard', desc: 'Progress tracking and traffic-light cost metrics' },
    { title: 'Document Generator', desc: '49 PMBOK templates with PDF export' },
    { title: 'Firebase Persistence', desc: 'Save tasks, docs, and metrics to cloud' },
    { title: 'Shareable Links', desc: 'URL-based sharing for testers' }
  ],
  next: [
    { title: 'Guided Project Wizard', desc: 'Onboarding to create projects step-by-step' },
    { title: 'Cost Forecasting', desc: 'Advanced EVM calculations (CPI, SPI, EAC)' },
    { title: 'Template Customization', desc: 'Edit and save custom PM templates' }
  ],
  future: [
    { title: 'AI-Powered Drafting', desc: 'Autofill templates with project details' },
    { title: 'Multi-Project Management', desc: 'Switch between multiple projects easily' },
    { title: 'User Accounts & Teams', desc: 'Collaborate with others in real time' },
    { title: 'Mobile Support', desc: 'Optimized UI for phone and tablet usage' }
  ]
}

export default function Roadmap() {
  const renderSection = (title, color, items) => (
    <Grid item xs={12} md={4}>
      <Card sx={{ borderTop: `4px solid ${color}`, minHeight: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color, mb: 2 }}>
            {title}
          </Typography>
          {items.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.desc}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Grid>
  )

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Roadmap
      </Typography>
      <Grid container spacing={2}>
        {renderSection('Now', '#1976d2', roadmapItems.now)}
        {renderSection('Next', '#ff9800', roadmapItems.next)}
        {renderSection('Future', '#9c27b0', roadmapItems.future)}
      </Grid>
    </Box>
  )
}
