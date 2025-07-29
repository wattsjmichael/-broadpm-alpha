import React from "react";
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  Button,
  useTheme,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DocumentModal from "./DocumentModal";
import { pmbokTemplates } from "../data/pmbokTemplates";
import { track } from "@vercel/analytics/react";

const processGroups = [
  "Initiating",
  "Planning",
  "Executing",
  "Monitoring & Controlling",
  "Closing",
];

export default function KanbanBoard({ tasks, setTasks }) {
  const theme = useTheme();

  // Map PMBOK groups to theme colors
  const columnColors = {
    Initiating: theme.palette.primary.main,
    Planning: theme.palette.secondary.main,
    Executing: theme.palette.info.main || "#9c27b0", // fallback to purple if no info color
    "Monitoring & Controlling": theme.palette.warning.main,
    Closing: theme.palette.error.main,
  };

  const columnWeights = {
    Initiating: 1,
    Planning: 2, // DOUBLE WIDTH
    Executing: 1,
    "Monitoring & Controlling": 1,
    Closing: 1,
  };

  const [openDoc, setOpenDoc] = React.useState(false);
  const [docContent, setDocContent] = React.useState("");
  const [docTitle, setDocTitle] = React.useState("");

  const openDocument = (taskName) => {
    setDocTitle(taskName);
    setDocContent(
      pmbokTemplates[taskName] || `# ${taskName}\n\n(No template yet)`
    );
    setOpenDoc(true);
    track("PDF Generated", {
      taskName,
    });
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(
      (t) => t.id.toString() === draggableId
    );
    const task = updatedTasks[taskIndex];
    updatedTasks[taskIndex] = {
      ...task,
      processGroup: destination.droppableId,
    };

    const columnTasks = updatedTasks
      .filter((t) => t.processGroup === destination.droppableId)
      .filter((t) => t.id.toString() !== draggableId);

    columnTasks.splice(destination.index, 0, updatedTasks[taskIndex]);
    const otherTasks = updatedTasks.filter(
      (t) => t.processGroup !== destination.droppableId
    );
    const newTaskOrder = [...otherTasks, ...columnTasks];

    setTasks(newTaskOrder);
  };

  const toggleCompletion = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
    const task = tasks.find((t) => t.id === id);
    track("Task Completed", {
      taskName: task.name,
      newState: !task.completed,
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {processGroups.map((group) => (
            <Droppable droppableId={group} key={group}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    p: 2,
                    minHeight: 400,
                    bgcolor: snapshot.isDraggingOver
                      ? `${columnColors[group]}22`
                      : "#f5f5f5",
                    borderTop: `4px solid ${columnColors[group]}`,
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{
                      mb: 1,
                      fontWeight: "bold",
                      color: columnColors[group],
                    }}
                  >
                    {group}
                  </Typography>

                  {tasks
                    .filter((task) => task.processGroup === group)
                    .map((task, index) => (
                      <Draggable
                        key={task.id.toString()}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 1,
                              mb: 1,
                              display: "flex",
                              alignItems: "center",
                              bgcolor: snapshot.isDragging
                                ? "#e3f2fd"
                                : "white",
                              boxShadow: snapshot.isDragging ? 4 : 1,
                              border: `1px solid ${columnColors[group]}55`,
                              transition: "background-color 0.2s ease",
                            }}
                          >
                            <Checkbox
                              checked={task.completed}
                              onChange={() => toggleCompletion(task.id)}
                              sx={{
                                color: columnColors[group],
                                "&.Mui-checked": { color: columnColors[group] },
                              }}
                            />
                            <Typography
                              sx={{
                                textDecoration: task.completed
                                  ? "line-through"
                                  : "none",
                                flexGrow: 1,
                              }}
                            >
                              {task.name}
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={() => openDocument(task.name)}
                              sx={{ ml: 1, flexShrink: 0 }}
                            >
                              Generate
                            </Button>
                          </Paper>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>

      <DocumentModal
        open={openDoc}
        onClose={() => setOpenDoc(false)}
        title={docTitle}
        content={docContent}
        setContent={setDocContent}
      />
    </>
  );
}
