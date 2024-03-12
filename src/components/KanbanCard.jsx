import { useDrag } from 'react-dnd';

const KanbanCard = ({ task }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { task },
  });

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        padding: '8px',
        border: '1px solid #ccc',
        marginBottom: '8px',
      }}
    >
      {task}
    </div>
  );
};

export default KanbanCard;