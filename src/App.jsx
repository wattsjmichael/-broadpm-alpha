import { useState, useEffect } from 'react'

import MetricsDashboard from './components/MetricsDashboard'
import CostMetrics from './components/CostMetrics'
import KanbanBoard from './components/KanbanBoard'
import ProjectWizard from './components/ProjectWizard'
import Roadmap from './components/Roadmap'
import HeaderBar from './components/HeaderBar'
import { saveProjectData, loadProjectData } from './services/firestore'

export default function App() {
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [costInputs, setCostInputs] = useState({ pv: 0, ev: 0, ac: 0, bac: 0 })
  const [docs, setDocs] = useState({})
  const [projectId, setProjectId] = useState(
    new URLSearchParams(window.location.search).get('id') ||
      localStorage.getItem('broadpmProjectId')
  )

  // --- Load from Firestore ---
  useEffect(() => {
    if (!projectId) return

    async function fetchData() {
      const data = await loadProjectData(projectId)
      if (data) {
        setProject(data.project || null)
        setTasks(data.tasks || [])
        setCostInputs(data.costInputs || { pv: 0, ev: 0, ac: 0, bac: 0 })
        setDocs(data.docs || {})
      }
    }
    fetchData()
  }, [projectId])

  // --- Save to Firestore on changes ---
  useEffect(() => {
    if (!project || !projectId) return

    const cleanData = JSON.parse(
      JSON.stringify({
        project,
        tasks,
        costInputs,
        docs
      })
    )

    saveProjectData(projectId, cleanData)
  }, [project, tasks, costInputs, docs, projectId])

  // --- Project creation ---
  const createProject = (proj) => {
    // Generate new ID when project is created
    const newId = `broadpm-${Date.now()}`
    setProjectId(newId)
    localStorage.setItem('broadpmProjectId', newId)

    // Update URL with new ID
    const newUrl = `${window.location.pathname}?id=${newId}`
    window.history.replaceState(null, '', newUrl)

    // Set project and seed tasks
    setProject(proj)
    import('./data/pmbokProcesses').then((module) => {
      setTasks(
        module.pmbokProcesses.map((p) => ({
          id: p.id,
          name: p.name,
          processGroup: p.processGroup,
          completed: false
        }))
      )
    })
  }

  return (
    <div>
      <HeaderBar
        onReset={() => {
          localStorage.removeItem('broadpmProjectId')
          setProjectId(null)
          const cleanUrl = window.location.pathname
          window.history.replaceState(null, '', cleanUrl)
          setProject(null)
          setTasks([])
          setCostInputs({ pv: 0, ev: 0, ac: 0, bac: 0 })
          setDocs({})
        }}
      />
      <div style={{ padding: 20 }}>
        {!project ? (
          <ProjectWizard onFinish={createProject} />
        ) : (
          <>
            <h2>{project.name}</h2>
            <MetricsDashboard tasks={tasks} budget={project.budget} />
            <CostMetrics projectBudget={project.budget} />
            <KanbanBoard tasks={tasks} setTasks={setTasks} />
            <Roadmap />
          </>
        )}
      </div>
    </div>
  )
}
