// src/components/KanbanLane.js
import React from 'react';
import KanbanCard from './KanbanCard';

const KanbanLane = ({ title, tasks }) => {

  return (
    <div style={{ border: '1px solid #ddd', padding: '16px' }}>
      <h3>{title}</h3>
      {tasks.map((task) => (
        <KanbanCard key={task.id} task={task.text} />
      ))}
    </div>
  );
};

export default KanbanLane;