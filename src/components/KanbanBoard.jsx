// src/components/KanbanBoard.js
import React from 'react';
import KanbanLane from './KanbanLane';

const KanbanBoard = () => {
  const tasks = [
    { id: 1, text: 'Tarea 1', status: 'Pendiente' },
    { id: 2, text: 'Tarea 2', status: 'Iniciado' },
    { id: 3, text: 'Tarea 3', status: 'Terminado' },
    
    // ... más tareas
  ];

  return (
    <div style={{ display: 'flex' }}>
      <KanbanLane title="Pendiente" tasks={tasks.filter((t) => t.status === 'Pendiente')} />
      <KanbanLane title="Iniciado" tasks={tasks.filter((t) => t.status === 'Iniciado')} />
      <KanbanLane title="Terminado" tasks={tasks.filter((t) => t.status === 'Terminado')} />
    </div>
  );
};

export default KanbanBoard;