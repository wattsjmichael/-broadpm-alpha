import React, { useState, useEffect } from 'react'
import { Paper, Typography, Grid, TextField, Tooltip, Box, Stack } from '@mui/material'

export default function CostMetrics({ projectBudget }) {
  // Inputs
  const [pv, setPV] = useState(0)
  const [ev, setEV] = useState(0)
  const [ac, setAC] = useState(0)
  const [bac, setBAC] = useState(0)

  // Auto-set BAC from projectBudget
  useEffect(() => {
    if (projectBudget) setBAC(projectBudget)
  }, [projectBudget])

  // Safe division
  const div = (a, b) => (b === 0 ? 0 : a / b)

  // Calculations
  const CV = ev - ac
  const SV = ev - pv
  const CPI = div(ev, ac)
  const SPI = div(ev, pv)
  const EAC = CPI === 0 ? 0 : div(bac, CPI)
  const ETC = EAC - ac
  const VAC = bac - EAC
  const TCPI = div((bac - ev), (bac - ac))

  // Formatter
  const fmt = (num) => Number.isFinite(num) ? num.toFixed(2) : '-'

  // Descriptions
  const descriptions = {
    CV: "Cost Variance: EV - AC. Positive = under budget, negative = over budget.",
    SV: "Schedule Variance: EV - PV. Positive = ahead of schedule, negative = behind.",
    CPI: "Cost Performance Index: EV ÷ AC. >1 = cost efficient, <1 = cost overrun.",
    SPI: "Schedule Performance Index: EV ÷ PV. >1 = ahead of schedule, <1 = behind.",
    EAC: "Estimate at Completion: BAC ÷ CPI. Forecasted total project cost.",
    ETC: "Estimate to Complete: EAC - AC. Cost to finish remaining work.",
    VAC: "Variance at Completion: BAC - EAC. Positive = surplus, negative = deficit.",
    TCPI: "To Complete PI: (BAC - EV) ÷ (BAC - AC). >1 = harder to meet budget."
  }

  // Color logic
  const getColor = (key, value) => {
    if (!Number.isFinite(value)) return 'inherit'

    switch (key) {
      case 'CPI':
      case 'SPI':
        if (value >= 1) return 'green'
        if (value >= 0.9) return 'orange'
        return 'red'
      case 'CV':
      case 'SV':
      case 'VAC':
        if (value > 0) return 'green'
        if (value === 0) return 'orange'
        return 'red'
      case 'EAC':
      case 'ETC':
        return value > bac ? 'red' : 'green'
      case 'TCPI':
        if (value <= 1) return 'green'
        if (value <= 1.1) return 'orange'
        return 'red'
      default:
        return 'inherit'
    }
  }

  const metrics = [
    { key: 'CV', label: 'Cost Variance (CV)', value: CV },
    { key: 'SV', label: 'Schedule Variance (SV)', value: SV },
    { key: 'CPI', label: 'Cost Performance Index (CPI)', value: CPI },
    { key: 'SPI', label: 'Schedule Performance Index (SPI)', value: SPI },
    { key: 'EAC', label: 'Estimate at Completion (EAC)', value: EAC },
    { key: 'ETC', label: 'Estimate to Complete (ETC)', value: ETC },
    { key: 'VAC', label: 'Variance at Completion (VAC)', value: VAC },
    { key: 'TCPI', label: 'To Complete PI (TCPI)', value: TCPI }
  ]

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Cost Metrics (EVM)
      </Typography>

      {/* Inputs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Planned Value (PV)"
            type="number"
            value={pv}
            onChange={(e) => setPV(parseFloat(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Earned Value (EV)"
            type="number"
            value={ev}
            onChange={(e) => setEV(parseFloat(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Actual Cost (AC)"
            type="number"
            value={ac}
            onChange={(e) => setAC(parseFloat(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Budget at Completion (BAC)"
            type="number"
            value={bac}
            onChange={(e) => setBAC(parseFloat(e.target.value) || 0)}
          />
        </Grid>
      </Grid>

      {/* Metrics */}
      <Grid container spacing={2}>
        {metrics.map((metric, index) => {
          const color = getColor(metric.key, metric.value)
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Tooltip title={descriptions[metric.key]} arrow>
                <Box
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    border: `2px solid ${color}`,
                    bgcolor: `${color}11`,
                    borderRadius: 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {metric.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color }}
                  >
                    {fmt(metric.value)}
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
          )
        })}
      </Grid>

      {/* Legend */}
      <Stack direction="row" spacing={2} sx={{ mt: 2, fontSize: '0.85rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, bgcolor: 'green', mr: 0.5 }} /> Good
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, bgcolor: 'orange', mr: 0.5 }} /> Caution
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, bgcolor: 'red', mr: 0.5 }} /> Needs Attention
        </Box>
      </Stack>
    </Paper>
  )
}
