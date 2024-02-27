import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Canva() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Tarea 1', status: 'Pendiente', date: '2024-02-27' },
    { id: 2, name: 'Tarea 2', status: 'Pendiente', date: '2024-02-28' },
    { id: 3, name: 'Tarea 3', status: 'Iniciado', date: '2024-02-29' },
    { id: 4, name: 'Tarea 4', status: 'Iniciado', date: '2024-02-29' },
    { id: 5, name: 'Tarea 5', status: 'Iniciado', date: '2024-02-29' },
    { id: 6, name: 'Tarea 6', status: 'Completado', date: '2024-02-29' },
    { id: 7, name: 'Tarea 7', status: 'Completado', date: '2024-02-29' },
    { id: 8, name: 'Tarea 8', status: 'Completado', date: '2024-02-29' },
  ]);

  function moveTask(fromIndex, toIndex, newStatus) {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);

    if (updatedTasks.filter((task) => task.status === newStatus).length === 0) {
      newStatus = 'Pendiente';
    }

    movedTask.status = newStatus;
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  }

  return (
<DndProvider backend={HTML5Backend}>
  <div className="flex h-full"> {/* Ajusta aquí la clase h-screen para que ocupe todo el alto de la pantalla */}
    {/* Manejo de columnas vacías */}
    {tasks.some((task) => task.status === '') && (
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4"></h1>
      </div>
    )}

    {/* Columna Pendiente */}
    <div className="flex-1 p-4 overflow-y-auto"> {/* Añade overflow-y-auto aquí */}
      <h1 className="text-xl font-bold mb-4">Pendiente</h1>
      <div className="bg-gray-100 h-64">
        {tasks.map((task, index) => {
          if (task.status === 'Pendiente') {
            return (
              <Task
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
              />
            );
          }
          return null;
        })}
      </div>
    </div>

    {/* Columna Iniciado */}
    <div className="flex-1 p-4 overflow-y-auto"> {/* Añade overflow-y-auto aquí */}
      <h1 className="text-xl font-bold mb-4">Iniciado</h1>
      <div className="bg-gray-100 h-64">
        {tasks.map((task, index) => {
          if (task.status === 'Iniciado') {
            return (
              <Task
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
              />
            );
          }
          return null;
        })}
      </div>
    </div>

    {/* Columna Completado */}
    <div className="flex-1 p-4 overflow-y-auto"> {/* Añade overflow-y-auto aquí */}
      <h1 className="text-xl font-bold mb-4">Completado</h1>
      <div className="bg-gray-100 h-64">
        {tasks.map((task, index) => {
          if (task.status === 'Completado') {
            return (
              <Task
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  </div>
</DndProvider>

  );
}

const canDrop = (item, monitor) => {
  const columnStatus = monitor.getItem().status;
  return item.type === 'TASK' && (columnStatus === '' || columnStatus === item.status || item.status === '');
};

function Task({ task, index, moveTask }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index, status: task.status },
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    canDrop,
    hover: (item) => {
      if (item.index !== index) {
        moveTask(item.index, index, task.status);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-gray-200 p-4 rounded mb-4 cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <p className="text-lg font-bold mb-2">{task.name}</p>
      <p className="text-sm text-gray-500">Fecha: {task.date}</p>
    </div>
  );
}

export default Canva;
